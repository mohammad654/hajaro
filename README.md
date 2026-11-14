# Hajaro Coaching — Bodybuilding & Personal Training Platform

A premium bodybuilding coaching website and client platform built with **Angular 22** (standalone components,
signals, zoneless change detection, SSR + prerendering).

It includes the public marketing site, an interactive **Full Body Muscle Chart**, an exercise library, training
programs, a workout planner, nutrition calculators, a blog, a client dashboard and a coach admin dashboard.

---

## Quick start

```bash
npm install
npm start              # Dutch dev server   → http://localhost:4200/
npm run start:en       # English dev server → http://localhost:4201/en/   (start:all runs both)
npm run build          # production build of both languages + prerendering (dist/hajaro)
npm run serve:ssr:hajaro   # serve the production build → http://localhost:4000
npm run verify         # typecheck + format check + EN/NL translation parity
```

### Languages (EN + NL)

Dutch is served at `/`, English at `/en/`; both are compiled at build time with `@angular/localize`.

- Mark text with `i18n` (templates) or `$localize` (TypeScript), then run `npm run i18n` and add the
  Dutch in `src/locale/messages.nl.xlf`. `npm run i18n:check` fails on anything missing.
- Translated URL segments (`/diensten`, `/over-mij`, …) live in `src/app/core/i18n/paths.ts`.
- Server settings (SMTP for the contact form, allowed hosts, proxy) are documented in `.env.example`.
  The site needs a Node host; a static host cannot send enquiries or answer redirects.

### Demo mode (no backend)

`environment.useMockApi` is `true` by default. All data is seeded from `src/app/core/data` and changes are saved
in the browser's localStorage, so every feature works without a server. On `/login` use:

- **Explore as client** — client dashboard (training, workout log, progress, check-ins…)
- **Explore as coach (admin)** — admin dashboard (clients, workout charts, content, SEO…)

No passwords are stored anywhere in the frontend.

---

## Before launch — replace placeholder content

| What                                                          | Where                                                                                                                      |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Domain (canonical URLs, sitemap, Open Graph)                  | `src/environments/environment.ts` → `siteUrl`                                                                              |
| Brand name, email, phone, service area, social links, address | `src/app/core/config/site.config.ts`                                                                                       |
| Trainer name, bio, journey, photo, methodology                | Admin → _Site content & SEO_ (seed: `core/data/site-content.data.ts`)                                                      |
| Qualifications, competitions, awards                          | Admin → _Site content_. Only items marked **verified** are shown publicly.                                                 |
| Package prices (currently **examples**)                       | Admin → _Packages & pricing_ (seed: `core/data/packages.data.ts`)                                                          |
| Program prices (optional self-guided purchase)                | Admin → _Programs & workout charts_                                                                                        |
| Client transformations & testimonials                         | Admin → _Transformations / Testimonials_. Shown only when published **and** consent is confirmed. Starts empty on purpose. |
| Exercise demo images / videos                                 | Admin → _Exercises_ (YouTube/Vimeo URLs are validated and loaded click-to-play)                                            |
| Legal pages                                                   | `src/app/features/legal/legal-content.ts` — have them reviewed for your jurisdiction                                       |
| Google Analytics 4 / Search Console                           | `environment.analytics` (GA loads only after cookie consent)                                                               |

Bracketed text such as `[Describe how you started training…]` marks copy the trainer still needs to write;
placeholder paragraphs are hidden from the public About page automatically.

### Photography

No stock photos are used to represent the coach or clients. `MediaFrame` shows a branded placeholder until a real
image path is configured. Put optimised images (WebP/AVIF, 4:5 for portraits) in `public/images/…` and reference
them from the admin. The anatomy artwork is an original SVG; the muscle-group overview image on `/muscle-chart`
was converted from the supplied `Full body muscle workout chart/Complete muscle group anatomy diagram.png`. The
other supplied screenshots carry third-party watermarks and were intentionally not used.

---

## Architecture

```
src/
├─ environments/              environment config (siteUrl, API, mock mode, analytics)
├─ server.ts                  Express SSR server: security headers, /sitemap.xml, /robots.txt, caching
├─ seo-files.ts               sitemap + robots generated from the same content data the app renders
├─ styles/                    design system: tokens, base, typography, layout, components, mixins
└─ app/
   ├─ core/
   │  ├─ api/                 repository boundary: EntityRepository + Local (demo) and HTTP adapters,
   │  │                       ApiError, interceptors (credentials, error normalisation)
   │  ├─ auth/                AuthService (cookie sessions / demo accounts), role guards
   │  ├─ config/              site & navigation config
   │  ├─ data/                seed content: muscles, anatomy shapes, exercises, programs, services…
   │  ├─ data-access/         signal-based stores per domain (one file each → lean lazy chunks)
   │  ├─ models/              strongly typed domain models
   │  ├─ seo/                 SeoService (meta, canonical, OG, JSON-LD), schema builders, 404 status
   │  └─ services/            storage, toasts, global error handler, analytics, hydration readiness
   ├─ layout/                 public header/footer, portal shell for dashboards
   ├─ shared/                 anatomy figure, cards, UI primitives, form helpers, pipes
   └─ features/               lazy-loaded pages
      ├─ home, about, services, programs, exercises, nutrition, transformations, pricing, blog, contact, legal
      ├─ muscle-chart/        anatomy explorer · muscle detail panel · workout chart table · split programs
      ├─ planner/             routine builder (FormArray) · session tracker · session history
      ├─ dashboard/           client portal (ClientPortal facade scopes all data to the signed-in user)
      └─ admin/               resource registry + generic list/editor, workout chart builder,
                              client management, inquiries, site content & SEO
```

### Key decisions

- **API boundary.** Features depend only on `EntityRepository<T>`. `injectRepository()` returns the localStorage
  adapter in demo mode or the REST adapter otherwise — no feature code changes when the backend arrives.
- **Signals everywhere** for state; RxJS only for async I/O (HTTP, router events, form streams).
- **Admin resource registry** (`features/admin/resources/resource.registry.ts`): one declarative config per entity
  (columns, search, filter, form schema, mapping) drives generic list and edit pages. Adding a manageable entity
  is a config, not new pages. Richer workflows (clients, workout chart builder, site content) have custom pages.
- **Articles are structured blocks**, not HTML — rendering is XSS-safe and the table of contents is generated
  automatically. The admin uses a small, safe markup (`## heading`, `- list`, `> callout`, `[link](/path)`).
- **Hydration safety.** Prerendered pages never depend on query params, sessions or storage during the first
  render; `ClientReady` applies those immediately after hydration.

---

## Backend API contract (when `useMockApi: false`)

Base URL: `environment.apiBaseUrl` (default `/api`). JSON everywhere. Authentication uses an **httpOnly session
cookie**; the frontend never reads or stores tokens.

| Endpoint                                              | Purpose                           |
| ----------------------------------------------------- | --------------------------------- |
| `POST /auth/login` `{ email, password }` → `AuthUser` | Sign in (sets the session cookie) |
| `GET /auth/me` → `AuthUser`                           | Restore session                   |
| `POST /auth/logout`                                   | Sign out                          |
| `GET /{resource}` → `T[]`                             | List                              |
| `POST /{resource}` → `T`                              | Create                            |
| `PATCH /{resource}/{id}` → `T`                        | Update                            |
| `DELETE /{resource}/{id}`                             | Delete                            |

Resources: `exercises`, `programs`, `services`, `packages`, `articles`, `site-content`, `transformations`,
`testimonials`, `inquiries`, `bookings`, `clients`, `measurements`, `progress-photos`, `check-ins`,
`notifications`, `routines`, `workout-sessions`.

The backend **must** enforce authorisation: clients may only read/write their own records (`clientId` /
`ownerId` = session user); admin-only resources require the `admin` role. Frontend validation is a UX layer and
never replaces server-side validation. Validation errors may be returned as `{ message, errors: { field: msg } }`.

---

## SEO

- Prerendered HTML for every public page (106 routes); unknown slugs are server-rendered with a real **404**.
- Unique title/description, canonical URL, Open Graph & Twitter tags per page; trainer-editable overrides.
- JSON-LD: Organization (+ LocalBusiness when an address is configured), WebSite, Person, Service, Course
  (programs), Article, HowTo (exercise steps), OfferCatalog (pricing), BreadcrumbList. No ratings or reviews are
  emitted, and FAQPage markup is intentionally omitted (Google restricts FAQ rich results to government/health sites).
- `/sitemap.xml` and `/robots.txt` are generated by the server from the content data.
- Friendly aliases (`/coaching`, `/plans`, `/anatomy`, …) redirect to canonical URLs.

## Accessibility & performance

- Semantic landmarks, one H1 per page, skip links, visible focus rings, labelled forms with linked error
  messages, keyboard-operable anatomy chart (every muscle is a focusable button plus an equivalent list),
  `prefers-reduced-motion` respected (animations and view transitions disabled).
- Lazy-loaded routes, incremental hydration for below-the-fold homepage sections, inlined fonts with
  `display=swap`, `NgOptimizedImage`, WebP assets, click-to-load video embeds, long-term caching of hashed bundles.

## Testing

No tests were added, per project instructions. The CLI-generated `tsconfig.spec.json` and `npm test` script are
unchanged.
