import express, { Request, Router } from 'express';
import { createTransport } from 'nodemailer';

/** What the contact form posts (see ContactRequest in core/contact/contact-gateway.ts). */
interface ContactPayload {
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly goals: readonly string[];
  readonly coachingType: string;
  readonly experience: string;
  readonly message: string;
  readonly wantsConsultation: boolean;
  readonly preferredTime?: string;
  readonly context?: string;
  readonly language: string;
  /** Honeypot: hidden from people, often filled in by bots. */
  readonly website?: string;
}

export interface MailMessage {
  readonly to: string;
  readonly from: string;
  /** Passed as a structured address so a visitor's name can never be parsed as address syntax. */
  readonly replyTo: { readonly name: string; readonly address: string };
  readonly subject: string;
  readonly text: string;
}

/** Anything that can deliver an email. SMTP by default; swap it for an API-based provider or a test fake. */
export interface MailTransport {
  send(message: MailMessage): Promise<void>;
}

export interface ContactConfig {
  /** Inbox that receives enquiries. */
  readonly to: string;
  /** Sender address the mail server is allowed to send as. */
  readonly from: string;
  readonly transport: MailTransport;
}

/**
 * Reads SMTP settings from the environment (see .env.example). Returns null when they are missing,
 * so the endpoint can answer 503 instead of pretending a message was sent.
 */
export function contactConfigFromEnv(env: NodeJS.ProcessEnv = process.env): ContactConfig | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = env;
  if (!SMTP_HOST || !CONTACT_TO || !CONTACT_FROM) return null;
  const port = Number(SMTP_PORT || 587);
  const transporter = createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS ?? '' } : undefined,
  });
  return {
    to: CONTACT_TO,
    from: CONTACT_FROM,
    transport: { send: async (message) => void (await transporter.sendMail(message)) },
  };
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
/** Control characters (incl. CR/LF, which could inject mail headers) except tab and newline in text. */
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const text = (value: unknown, max: number, { multiline = false, required = true } = {}) => {
  if (value === undefined || value === null || value === '') return required ? null : '';
  if (typeof value !== 'string') return null;
  let clean = value.replace(CONTROL, '').trim();
  if (!multiline) clean = clean.replace(/[\r\n]+/g, ' ');
  if ((required && !clean) || clean.length > max) return null;
  return clean;
};

/** Returns the cleaned payload, or the names of the invalid fields. */
export function validateContact(body: unknown): ContactPayload | { invalid: string[] } {
  const b = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const invalid: string[] = [];
  const field = <T>(name: string, value: T | null): T => {
    if (value === null) invalid.push(name);
    return value as T;
  };

  const name = field('name', text(b['name'], 80));
  const email = field('email', text(b['email'], 254));
  if (email && !EMAIL.test(email)) invalid.push('email');
  const goals = Array.isArray(b['goals'])
    ? b['goals'].map((g) => text(g, 80)).filter((g): g is string => !!g)
    : null;
  if (!goals || goals.length === 0 || goals.length > 10) invalid.push('goals');

  const payload: ContactPayload = {
    name,
    email,
    phone: field('phone', text(b['phone'], 30, { required: false })) || undefined,
    goals: goals ?? [],
    coachingType: field('coachingType', text(b['coachingType'], 40)),
    experience: field('experience', text(b['experience'], 40)),
    message: field('message', text(b['message'], 2000, { multiline: true })),
    wantsConsultation: b['wantsConsultation'] === true,
    preferredTime:
      field('preferredTime', text(b['preferredTime'], 60, { required: false })) || undefined,
    context: field('context', text(b['context'], 160, { required: false })) || undefined,
    language: field('language', text(b['language'], 5)),
    website: typeof b['website'] === 'string' ? b['website'] : '',
  };
  return invalid.length ? { invalid: [...new Set(invalid)] } : payload;
}

function toMail(p: ContactPayload, config: ContactConfig): MailMessage {
  const lines = [
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    p.phone ? `Phone: ${p.phone}` : null,
    `Website language: ${p.language}`,
    p.context ? `Asked about: ${p.context}` : null,
    '',
    `Goals: ${p.goals.join(', ')}`,
    `Coaching type: ${p.coachingType}`,
    `Experience: ${p.experience}`,
    `Free consultation: ${p.wantsConsultation ? `yes (${p.preferredTime ?? 'any time'})` : 'no'}`,
    '',
    'Message:',
    p.message,
  ];
  return {
    to: config.to,
    from: config.from,
    replyTo: { name: p.name, address: p.email },
    subject: `New enquiry from ${p.name}`,
    text: lines.filter((line) => line !== null).join('\n'),
  };
}

/** Small fixed-window limiter per client IP (kept in memory: fine for a single server process). */
function rateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (key: string): boolean => {
    const now = Date.now();
    if (hits.size > 10_000) {
      for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    }
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    entry.count++;
    return entry.count <= limit;
  };
}

/** Only accept posts made by this site's own pages (browsers always send Origin on POST). */
function isSameOrigin(req: Request): boolean {
  const origin = req.get('origin');
  if (!origin) return true; // Non-browser clients; they still need the JSON body and pass validation.
  try {
    return new URL(origin).host === req.get('host');
  } catch {
    return false;
  }
}

/**
 * POST /api/contact — validates an enquiry and emails it to the coach.
 *
 * Responses: 204 sent · 400 invalid fields · 403 cross-site · 415 not JSON · 429 rate limited ·
 * 503 mail not configured / delivery failed. Error bodies carry a code, never internal details.
 */
export function contactRouter(config: ContactConfig | null): Router {
  const router = Router();
  const allow = rateLimiter(5, 15 * 60 * 1000);

  router.post('/', express.json({ limit: '16kb' }), async (req, res) => {
    if (!req.is('application/json')) return res.status(415).json({ error: 'unsupported' });
    if (!isSameOrigin(req)) return res.status(403).json({ error: 'forbidden' });
    if (!allow(req.ip ?? 'unknown')) return res.status(429).json({ error: 'rate_limited' });

    const result = validateContact(req.body);
    if ('invalid' in result)
      return res.status(400).json({ error: 'invalid', fields: result.invalid });
    // Bots that fill the honeypot get the same answer as people, but nothing is sent.
    if (result.website) return res.status(204).end();

    if (!config) {
      console.error('Contact form: SMTP is not configured (see .env.example). Enquiry not sent.');
      return res.status(503).json({ error: 'unavailable' });
    }
    try {
      await config.transport.send(toMail(result, config));
      return res.status(204).end();
    } catch (error) {
      console.error('Contact form: sending the email failed.', error);
      return res.status(503).json({ error: 'unavailable' });
    }
  });

  // Malformed or oversized JSON: answer in the same format instead of Express' HTML error page.
  router.use(
    (error: unknown, _req: Request, res: express.Response, next: express.NextFunction): void => {
      const status = (error as { status?: number }).status;
      if (status === 400 || status === 413) res.status(400).json({ error: 'invalid', fields: [] });
      else next(error);
    },
  );

  return router;
}
