# Audit report: Hajaro Coaching (EN + NL)

Branch `audit/full-review`, starting from the baseline commit `d889ae1`. Nothing has been pushed or deployed by this audit.

## Summary

- **Both languages work.** Dutch is the default at `/`, English is at `/en/`, and URLs are translated (`/diensten/wedstrijdvoorbereiding`, `/en/services/contest-prep`). Every public page, form, error message, label and content item is translated: 2,301 messages, checked by `npm run i18n:check`.
- **Enquiries reach you.** The contact form used to save messages only in the visitor's own browser. It now emails them through the server, with validation, rate limiting and spam protection.
- **Mobile is faster and accessibility is clean.** Mobile performance went from 66–74 to 86–92. Accessibility, Best Practices and SEO now score 100 on every page tested.
- **SEO is consistent per language.** Every page has a canonical URL, `hreflang` tags, `og:locale` and a sitemap entry with language alternates. Old URLs answer with 301 redirects. Titles fit 60 characters (was 162 pages over).
- **The copy is rewritten.** It now uses a first-person, plain voice and contains no invented facts. The Dutch is written natively with informal "je".
- **Still open:** real business facts (see TODO-FACT), translation of the client dashboard and admin, mobile LCP (about 3.0 s against a 2.5 s target), and ESLint and tests.

## Before and after

Lighthouse 12, local production build, simulated mobile (slow 4G, 4× CPU slowdown) and desktop.

| Page                          | Perf mobile | Perf desktop | A11y    | Best pr. | SEO | LCP mobile | CLS   |
| ----------------------------- | ----------- | ------------ | ------- | -------- | --- | ---------- | ----- |
| Home, before (English at `/`) | 66          | 95           | 96      | 100      | 100 | 5.69 s     | 0.000 |
| Home, after (`/` Dutch)       | **91**      | **100**      | **100** | 100      | 100 | **3.01 s** | 0.008 |
| Home, after (`/en/`)          | **91**      | **100**      | **100** | 100      | 100 | **3.01 s** | 0.000 |
| Service page, before          | 74          | 98           | 96      | 100      | 100 | 4.51 s     | 0.033 |
| Service page, after           | **92**      | **100**      | **100** | 100      | 100 | **2.86 s** | 0.000 |
| Contact, before               | 70          | 98           | 96      | 100      | 100 | 4.96 s     | 0.021 |
| Contact, after                | **86**      | **100**      | **100** | 100      | 100 | **2.92 s** | 0.000 |

| Metric                                                         | Before                          | After            |
| -------------------------------------------------------------- | ------------------------------- | ---------------- |
| Home HTML on the wire                                          | 150 kB (uncompressed)           | 23 kB (Brotli)   |
| JS loaded on first visit (transfer)                            | 131 kB                          | 133 kB           |
| CSS (transfer)                                                 | 3.6 kB                          | 3.8 kB           |
| Titles over 60 chars / descriptions over 155 chars (212 pages) | 162 / 66                        | 0 / 0            |
| Third-party requests on page load                              | Google Fonts (CSS + font files) | none             |
| Pages translated into Dutch                                    | header and footer only          | all public pages |

JS budget: the first visit should stay at or below 150 kB transferred. It's 133 kB today; the production build warns at 600 kB raw.

## What changed, per phase

### Phase 1: languages

- **URL structure** (`core/i18n/paths.ts`, `locales.ts`, `current-locale.ts`): one table of translated URL segments. Code uses canonical paths; the table translates them for routes, links (`localePath` pipe), canonical and `hreflang` tags, the sitemap and the language switcher. An ambiguous table fails the build.
- **Old URLs** (`src/legacy-redirects.ts`, `server.ts`): every URL of the previous structure redirects with a 301. The bare `/` sends a returning visitor to the language they picked (cookie `lang`, 302, never cached). Crawlers are never redirected.
- **Language switcher** (`shared/ui/language-switcher.ts`): shows flags, links to the same page in the other language, works with the keyboard and marks the current language with `aria-current`.
- **Translation tooling** (`scripts/i18n.mjs`):
  - `npm run i18n` extracts the text and syncs the Dutch file.
  - `npm run i18n:check` fails on missing, empty, untranslated (unless marked reviewed), unused or placeholder-mismatched messages.
- **Locale formatting:** dates and currency follow the page language through Angular. Decimal numbers too: "1,5 min" and BMI "23,4" in Dutch. Counts use proper plurals.
- **Translated:** all public pages, header and footer, forms and validation, the 404 page, the cookie banner, legal pages, and every content file (services, packages, FAQs, programs, exercises, muscles, articles, nutrition).

### Phase 2: code quality

- **Contact form:**
  - The form depends on a `ContactGateway` abstraction (`core/contact/contact-gateway.ts`).
  - The server endpoint (`src/server/contact.ts`) sends mail through a `MailTransport` interface.
  - Without SMTP settings it answers 503, and the form tells the visitor to email instead of showing a false success.
- **Duplication removed:**
  - The seeded SEO texts that repeated each page's title and description.
  - Three copies of the credentials list on the About page.
  - Two billing-period label maps.
- **Bugs fixed:**
  - Pricing and service pages showed the raw period key (`/ month` built from `month`).
  - "We couldn't find that {thing}" can't be translated, so the 404 component now takes a full heading.
- **Verification:** `npm run verify` runs the typecheck, Prettier check and translation parity. `.env.example` documents every environment variable, and `.env` is git-ignored.

### Phase 3: SEO

- Canonical, `hreflang` (nl, en, x-default) and `og:locale` plus `og:locale:alternate` on every page. The sitemap lists both languages with alternates. `robots.txt` covers both languages.
- **Titles:** the brand suffix is added only when the title stays within 60 characters. Over-long exercise and program title patterns were shortened.
- **Redirects:** friendly aliases (`/coaching` and others) are now 301 instead of 302.
- **Checked:** one `<h1>` per page and no duplicate titles within a language.

### Phase 4: performance

- Brotli/gzip compression on the server (`compression`) and `Cache-Control: no-cache` on HTML.
- The 1-year immutable cache now also covers the localized chunk names (`chunk-BAi-Ibvi.js`); the old pattern missed them.
- Fonts are self-hosted (`public/fonts`, Latin subset, Inter as one variable file). The two fonts the first screen needs are preloaded.

### Phase 5: design, UX, accessibility

- **WhatsApp button:** dark text on green (contrast 10:1, was 2:1), and its accessible name starts with the visible label.
- **No horizontal overflow at 360, 390, 768 and 1024 px**, checked with a script on both languages:
  - Grids use a shrinkable column.
  - Long words wrap and headings hyphenate.
  - Buttons wrap their label when it doesn't fit.
- **One name for the main action everywhere:** "Book a free intro" / "Plan een gratis kennismaking".
- **Hidden until filled:** the About page's credentials section, which used to say "will be listed here".

### Phase 6: copy

- **English:** rewritten in the first person ("I"). Removed em dashes used as connectors, "not X, they are Y" contrasts, hype ("transform your journey", "dramatically", "Real people. Real work. Real results."), and the "visible changes within 8–12 weeks" promise.
- **Dutch:** written natively with informal "je" and gym terms Dutch lifters use (personal training, bulken, deadlift, lat pulldown).
- **Medical:** the disclaimer lines are kept and simplified.

## Code added and removed

- **Dependencies added:**
  - `@angular/localize`: build-time translations.
  - `compression`: HTTP compression.
  - `nodemailer` (no sub-dependencies): SMTP for the contact form.
  - `@types/compression` and `@types/nodemailer`.
- **Removed:**
  - Google Fonts (`index.html`).
  - The seeded SEO duplicates.
  - The `DELIVERY_LABELS` and `PERIOD_LABELS` copies.
  - The "will be listed here" credentials notice.
  - The contact form's write to the browser-only demo store.
- **Kept out of git:** the 11 MB `Full body muscle workout chart/` source folder (screenshots with third-party watermarks). It's still on disk.
- **Dead code:** a local scan of exported names found no unused code; some exports are wider than needed. `knip` couldn't be run (download not allowed in this session).

## TODO-FACT: what only you can supply

| Fact                                                                                                                                        | Where it goes                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Trainer's real name (now "Coach Hajaro")                                                                                                    | `core/data/site-content.data.ts`, `articles.data.ts` (author)                                       |
| City / region, and whether there is a public training address                                                                               | `core/config/site.config.ts` (`serviceArea`, `address`), FAQ "Where do you train?" (`faqs.data.ts`) |
| Domain (canonical URLs, sitemap now point to `www.example.com`)                                                                             | `src/environments/environment.ts` → `siteUrl`                                                       |
| Email (now `hello@example.com`), phone, WhatsApp number, social links                                                                       | `site.config.ts`                                                                                    |
| Bio, how you started, competition history, personal details                                                                                 | `site-content.data.ts`, `[TODO-FACT: …]` lines (hidden until replaced)                              |
| Qualifications and certificates (set `verified: true` when real)                                                                            | `site-content.data.ts` or Admin → Site content                                                      |
| Real prices, minimum terms, reply times, call lengths                                                                                       | `core/data/packages.data.ts` (all are examples)                                                     |
| Service details: plan update rhythm (4 to 6 weeks), plan delivery (3 to 5 working days), video feedback, 20-minute intro call, "free" intro | `services.data.ts`, `contact-form.html`                                                             |
| Reply time you can keep (now "within two working days")                                                                                     | `site.config.ts` → `responseTime`                                                                   |
| Whether you have competed / may coach contest prep                                                                                          | Decides whether "Contest Prep" and "Posing Coaching" stay                                           |
| KvK number                                                                                                                                  | Footer (not added yet)                                                                              |
| Real photos and a share image per language                                                                                                  | `public/images`, Admin → Site content                                                               |

## Risks and decisions for you

1. **Hosting:** the site needs a host that runs Node (email, redirects, 404 status codes, compression). GitHub Pages is fine as a design preview only. Set `NG_ALLOWED_HOSTS`, `TRUST_PROXY` and the SMTP settings on the real host (`.env.example`).
2. **The demo login is public.** "Explore as coach (admin)" on `/login` is live while `useMockApi` is `true`. It only touches the visitor's own browser storage, but it looks like an admin area. Decide whether to hide it before launch.
3. **Client dashboard and admin are still English.** Shared parts (planner, labels, validation, toasts) are translated; the dashboard and admin screens aren't. The dashboard is used by your clients, so it's the next translation task.
4. **Demo-mode content edits are shared by both languages** (one browser storage per site). A real API needs content per language.
5. **Legal pages** are updated templates in both languages. Have them reviewed (AVG/GDPR, consumer law, KvK details).
6. **The language cookie** is functional (it only stores the language code), so I didn't put it behind consent. Confirm this with your legal reviewer.
7. **Mobile LCP is about 3.0 s.** That's the main remaining performance gap (font swap and hydration work on the hero).

## Recommended next steps

1. Fill in the TODO-FACT items, starting with the domain, name, email, prices and city.
2. Choose a Node host, set SMTP and send a test enquiry in both languages.
3. Translate the client dashboard (about 700 words), then the admin (about 1,200 words).
4. Add ESLint (`angular-eslint`) and a few unit tests for `paths.ts`, the redirects and contact validation.
5. Improve mobile LCP: font fallback metrics (`size-adjust`) for the hero heading, and less hydration work on the home page.
6. Add an FAQ page (`/veelgestelde-vragen`, `/en/faq`) with `FAQPage` structured data, as in the copy file.
7. After launch: Google Search Console with both languages, and a Google Business Profile once there's a public address.
