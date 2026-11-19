# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Hajaro Coaching: bodybuilding coaching site + client/coach platform. Angular 22 (standalone components, signals,
zoneless, SSR + prerendering), built for two languages: Dutch (source of truth for visitors) and English.

## Current phase: English-only layout

`PROJECT_STRUCTURE.md` holds the active phase, its working rules, the Deferred list and the Change log. Read it
first and log each task there. In Phase 1, unless the task says otherwise: no tests, builds, dev server, SEO work
or new dependencies, and no changes to Dutch files.

Dutch is switched off for now. `ENABLED_LANGUAGES` in `core/i18n/locales.ts` is `['en']`, so English is served at
the site root, the production build has `localize: false`, and the server temporarily redirects Dutch and `/en`
URLs to the English page. The comment in `locales.ts` lists what to restore in `angular.json`.

## Commands

```bash
npm start              # dev server → http://localhost:4200/ (English while Dutch is off)
npm run start:en       # same build on :4201 while Dutch is off (start:all runs both)
npm run build          # production build + prerendering → dist/hajaro
npm run serve:ssr:hajaro   # serve the production build (Express) → http://localhost:4000
npm run verify         # typecheck + format:check + i18n:check — run before committing
npm run typecheck      # tsc only
npm run format:check   # prettier only
npm run i18n           # extract messages, then REWRITE src/locale/messages.nl.xlf (not during Phase 1)
npm run i18n:check     # checks Dutch against the last extracted messages.xlf; new strings count only after extraction
```

There are no spec files; the project deliberately ships without tests (`npm test` is the untouched CLI default).
Verification is `npm run verify` plus checking the running app.

`bash deploy-hajaro.sh` publishes to GitHub Pages (https://mohammad654.github.io/hajaro/). It runs `git add .`,
commits everything as `Deploy: <date>`, pushes `main`, then `ng deploy --base-href=/hajaro/` to `gh-pages`.
Commit real changes with a proper message first. GitHub Pages is static: the contact form, server redirects and
the remembered-language redirect do not work there (they need `src/server.ts`).

## Internationalisation (affects almost every change)

This describes the two-language setup that returns when Dutch is enabled again. `i18n` and `$localize` markers
are still required now.

- Two separate builds via `@angular/localize`: source locale `en` at subPath `en`, `nl` at subPath `''` (root).
  Each dev server serves one locale; `environment.development.ts` `localeOrigins` lets the language switcher
  jump between the two dev servers.
- All user-visible text needs `i18n` (templates) or `$localize` (TS) — including toasts and error messages —
  then `npm run i18n` and a Dutch `<target state="translated">` in `messages.nl.xlf`. Dutch copy uses informal
  "je". A target identical to the English source must be marked `state="final"` or `i18n:check` fails.
- `CURRENT_LOCALE` (`core/i18n/current-locale.ts`) is resolved at build time from a `$localize` message.
- URLs are translated: code always uses **canonical English paths**; `core/i18n/paths.ts` maps segments per
  locale (`/services` → `/diensten`). Translate only at the edges: route config and `lp()`, the `localePath` pipe
  for `routerLink`, SEO canonical/hreflang, sitemap, language switcher. `paths.ts` is plain data (no
  `$localize`) because the Express server imports it too.
- The site must work under a sub-path (`/hajaro/` on GitHub Pages; each locale's `<base href>` is root + locale
  prefix). Never hard-code root-absolute URLs (`/fonts/…`, `/en/…`): use base-relative URLs or derive from the
  base href. Font URLs are relative and listed in `angular.json` `externalDependencies` so the build keeps them.

## Architecture

- `src/server.ts` (Express): security headers, legacy/alias 301s and remembered-language redirect
  (`legacy-redirects.ts`), `/sitemap.xml` + `/robots.txt` (`seo-files.ts`, generated from the same data the
  app renders), the contact endpoint `/api/contact` (`server/contact.ts`, SMTP settings in `.env.example`),
  static + SSR. `server/localize-passthrough.ts` must stay the first import of `server.ts`: content data uses
  `$localize`, and the Express entry runs outside the localized bundles.
- `app.routes.server.ts`: public pages are prerendered (slug lists come from `core/data`), unknown slugs SSR
  with a real 404, authenticated areas (dashboard/admin/login) are client-only.
- **API boundary**: features depend only on `EntityRepository<T>` (`core/api`). `injectRepository()` returns
  the localStorage adapter when `environment.useMockApi` is true (default; seeded from `core/data`, bump
  `dataVersion` when seed shape changes) or the REST adapter otherwise. The backend contract is in README.md.
  HTTP errors are normalised to `ApiError` (user-safe, localised messages) by an interceptor. In this demo mode,
  `/login` offers "Explore as client" and "Explore as coach (admin)".
- **State**: signal-based stores per domain in `core/data-access` (one file each for lean lazy chunks); RxJS
  only for async I/O. The client dashboard goes through the `ClientPortal` facade, which scopes data to the
  signed-in user.
- **Admin resource registry** (`features/admin/resources/resource.registry.ts`): one declarative config per
  entity drives the generic list/edit pages. A new manageable entity is a config entry, not new pages.
- **Articles are structured blocks**, not HTML (XSS-safe rendering, generated TOC). The admin edits them in a
  small safe markup (`## heading`, `- list`, `> callout`, `[link](/path)`), parsed in
  `features/admin/resources/article-markup.ts`.
- **Hydration safety**: prerendered output must not depend on query params, session or storage in the first
  render; use `ClientReady` (`core/services/client-ready`) to apply those after hydration.
- **Errors**: `GlobalErrorHandler` logs everything (`[Hajaro] Unhandled error`) but only toasts actionable
  errors — browser noise (ResizeObserver loop, cross-origin `Script error.`, `AbortError`, extension errors) is
  filtered. `ToastService` dedupes identical messages.
- Styles: design tokens and global system in `src/styles/` (CSS custom properties such as `--c-*`, `--sp-*`);
  components use those tokens. Desktop breakpoint is 1080px (`$bp-lg`, mirrored in `site-header.ts`).
- **Homepage images**: the root `images/` folder is published at `images/home/` through `angular.json` assets.
  The trainer teaser shows a temporary stock photo until `trainerPhotoUrl` is set; see the Deferred list.
- **Hero carousel**: uses only Bootstrap's carousel script (`bootstrap/js/src/carousel.js`), loaded after render,
  with types in `src/bootstrap-carousel.d.ts`. Its CSS is handwritten in `home-hero.scss`, so no Bootstrap CSS
  reaches the rest of the site.
- Site-wide facts (brand, contact, socials) live in `core/config/site.config.ts`; `environment.siteUrl` drives
  canonical URLs. Placeholder copy is bracketed (`[Describe …]`) and hidden publicly — never invent facts about
  the trainer, prices or results (see README "Before launch"). Credentials appear only when verified;
  transformations and testimonials only when published with confirmed consent.

## Conventions

- Prettier: 100 columns, single quotes, Angular parser for HTML (`npm run verify` checks it).
- Standalone components with `ChangeDetectionStrategy.OnPush`, `inject()`, signal inputs, built-in control
  flow (`@if`/`@for`).
