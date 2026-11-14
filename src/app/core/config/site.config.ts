/**
 * Static brand and business configuration.
 * Visitor-facing copy uses $localize (translated per language at build time; see src/locale).
 * EDIT THIS FILE with the real business details before launch.
 * Editable marketing copy (bio, hero text, credentials) is managed in the admin dashboard → Site content.
 */
export const SITE_CONFIG = {
  brandName: 'Hajaro',
  brandSuffix: 'Coaching',
  legalName: 'Hajaro Coaching',
  tagline: $localize`Premium bodybuilding & personal training`,
  defaultDescription: $localize`Online and in-person bodybuilding coaching with individual training programs, nutrition guidance and weekly check-ins. Build muscle, lose fat and train with structure.`,
  currency: 'EUR',
  contact: {
    email: 'hello@example.com',
    phone: '',
    /**
     * WhatsApp chat. `number` in international format with country code (e.g. '+49 151 2345678').
     * The floating chat button, footer and contact-page links are always shown; without a number
     * WhatsApp makes the visitor pick a contact, so set this before launch.
     */
    whatsapp: {
      number: '',
      /** Pre-filled first message the visitor can edit before sending. */
      message: $localize`Hi Hajaro, I would like to know more about your coaching.`,
    },
    /** City / area for in-person sessions. Leave empty for online-only businesses. */
    serviceArea: $localize`Online worldwide · In-person by appointment`,
    /** CONFIRM: the reply time the coach can actually keep. */
    responseTime: $localize`I reply to every message within two working days.`,
  },
  /**
   * LocalBusiness structured data is emitted only when a physical address is provided.
   */
  address: null as null | {
    readonly streetAddress: string;
    readonly addressLocality: string;
    readonly postalCode: string;
    readonly addressCountry: string;
  },
  social: [
    { label: 'Instagram', url: '', icon: 'instagram' },
    { label: 'YouTube', url: '', icon: 'youtube' },
    { label: 'TikTok', url: '', icon: 'tiktok' },
  ],
  defaultOgImage: '/images/og/og-default.png',
} as const;

export type SiteConfig = typeof SITE_CONFIG;
