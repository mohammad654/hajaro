# Hajaro: project structure and working rules

Put this file in the project root. Tell the AI at the start of every session:
"Read PROJECT_STRUCTURE.md first. Do not scan the project. Do only the task I give you."

---

## 1. Current phase: PHASE 1, ENGLISH LAYOUT ONLY

Focus on one thing: building a good-looking, responsive layout, in English.

**Do:**
- Build and adjust layout, spacing, sections, grid, responsive behaviour and visual style.
- Use the current colours, fonts and look. Do not change the palette.
- Write visible text in English only, in the EN translation file.
- Keep all pages and routes.

**Do not (yet):**
- No tests, no builds, no dev server, no Lighthouse, no browser.
- No clean-code or SOLID refactoring, no removing duplication. Messy but working is fine for now.
- No Dutch. Do not touch the NL translation file.
- No SEO work (titles, meta, hreflang, schema, sitemap).
- No new dependencies.

If a task needs something from a later phase, do the minimum for the layout and add one line to "Deferred list" (section 6).

---

## 2. Token-saving rules (the AI must follow these)

1. Read this file first. Use the map in section 3 instead of exploring the project.
2. Read only the files the task needs. Never open: `node_modules`, `dist`, `.angular`, `.git`, lock files, images, fonts, videos, source maps, generated files.
3. To find something, search with grep or file name first, then read only the relevant lines or file.
4. Do not read a file twice in one session. Do not re-read a file you just edited.
5. Edit in place with small changes. Never rewrite a whole file to change a few lines.
6. Do not paste code back to me. Do not explain what the code does.
7. Reply in 5 lines or fewer: what changed, which files. Then stop.
8. One task per message. Do not start extra work. Do not suggest ideas unless asked.
9. After each task, add one line to the "Change log" (section 7) and update the map in section 3 only if files were added, moved or deleted.
10. Do not create new documentation, reports or summaries. This file is the only notes file.

---

## 3. Project map (fill in once, keep it updated)

Generate the tree once and paste it here, instead of exploring every session:

```bash
tree -a -I 'node_modules|dist|.angular|.git|*.png|*.jpg|*.jpeg|*.webp|*.avif|*.svg|*.mp4|*.woff2' -L 4
```

(If `tree` is not installed: `find . -type f -not -path './node_modules/*' -not -path './dist/*' -not -path './.angular/*' -not -path './.git/*' | head -200`)

```text
src
├── app
│   ├── core
│   │   ├── api
│   │   ├── auth
│   │   ├── config
│   │   ├── contact
│   │   ├── data
│   │   ├── data-access
│   │   ├── i18n
│   │   ├── models
│   │   ├── seo
│   │   └── services
│   ├── features
│   │   ├── about
│   │   ├── admin
│   │   ├── auth
│   │   ├── blog
│   │   ├── contact
│   │   ├── dashboard
│   │   ├── exercises
│   │   ├── home
│   │   ├── legal
│   │   ├── muscle-chart
│   │   ├── not-found
│   │   ├── nutrition
│   │   ├── planner
│   │   ├── pricing
│   │   ├── programs
│   │   ├── services
│   │   └── transformations
│   ├── layout
│   │   ├── portal-shell
│   │   ├── site-footer
│   │   └── site-header
│   └── shared
│       ├── anatomy
│       ├── cards
│       ├── forms
│       ├── pipes
│       └── ui
├── environments
├── locale
├── server
└── styles
images/   source photos, published at images/home/ (unused files excluded in angular.json)
public/   fonts/, icons/, images/anatomy/, images/og/, manifest.webmanifest
```

### Key locations (fill in)
| What | Path |
|---|---|
| Routes | `src/app/app.routes.ts` |
| Global styles and tokens | `src/styles/` (`_tokens`, `_mixins` with breakpoints, `_components`, `_layout`, `_typography`) |
| EN translations | source text in templates (`i18n`) and `$localize`; extracted to `src/locale/messages.xlf` |
| NL translations (do not touch in Phase 1) | `src/locale/messages.nl.xlf` |
| Header / nav | `src/app/layout/site-header/`, links in `src/app/core/config/navigation.config.ts` |
| Footer | `src/app/layout/site-footer/` |
| Home page | `src/app/features/home/` (`sections/`, `home.content.ts`) |
| Other pages | see the Pages table |
| Shared components | `src/app/shared/` (`ui/`, `cards/`, `forms/`, `anatomy/`, `pipes/`) |
| Images and assets | `images/` (published at `images/home/`), `public/`; stock credits in `IMAGE_CREDITS.md` |

### Pages
| Page | Route | Component path | Sections on the page |
|---|---|---|---|
| Home | `/` | `src/app/features/home/home-page.ts` | Hero, services, process, coach, muscles, CTA (`sections/`) |
| About | `/about` | `src/app/features/about/about-page.ts` | Bio and photo, method, credentials, reasons, CTA |
| Services | `/services` | `src/app/features/services/services-page.ts` | Service cards, fit table, FAQ, CTA |
| Service detail | `/services/:slug` | `src/app/features/services/service-detail-page.ts` | Details, summary sidebar, related programs, CTA |
| Programs | `/programs` | `src/app/features/programs/programs-page.ts` | Filters, program cards, CTA |
| Program detail | `/programs/:slug` | `src/app/features/programs/program-detail-page.ts` | Overview, schedule, sidebar, related, CTA |
| Exercises | `/exercises` | `src/app/features/exercises/exercise-library-page.ts` | Search, filters, exercise cards |
| Exercise detail | `/exercises/:slug` | `src/app/features/exercises/exercise-detail-page.ts` | Technique, muscles sidebar, related |
| Muscle chart | `/muscle-chart` | `src/app/features/muscle-chart/muscle-chart-page.ts` | Explorer, workout chart, splits, overview, CTA |
| Workout planner | `/workout-planner` | `src/app/features/planner/workout-planner-page.ts` | Planner tool |
| Nutrition | `/nutrition` | `src/app/features/nutrition/nutrition-page.ts` | Topics, articles, CTA |
| Calculators | `/nutrition/calculators` | `src/app/features/nutrition/calculators-page.ts` | Calculator tool, CTA |
| Transformations | `/transformations` | `src/app/features/transformations/transformations-page.ts` | Client stories, quotes, consent, CTA |
| Pricing | `/pricing` | `src/app/features/pricing/pricing-page.ts` | Packages, comparison, FAQ, CTA |
| Blog | `/blog`, `/blog/category/:category` | `src/app/features/blog/blog-page.ts` | Categories, article cards, CTA |
| Article | `/blog/:slug` | `src/app/features/blog/article-page.ts` | Article, related, CTA |
| Contact | `/contact` | `src/app/features/contact/contact-page.ts` | Form, details sidebar |
| Login | `/login` | `src/app/features/auth/login-page.ts` | Sign-in card, illustration |
| Legal | `/privacy`, `/terms`, `/disclaimer` | `src/app/features/legal/legal-page.ts` | Legal text |
| 404 | `**` | `src/app/features/not-found/not-found-page.ts` | Message and links |

### Image tracker

Files are in `images/`, published at `images/home/`. Each file is used once.

| Page | Spot | File | Status |
|---|---|---|---|
| Home | Hero carousel | `hireink-fitness-3679464_1920.jpg`, `johan_benitez99co-ai-generated-9372728_1920.png`, `zuzyusa-dumbbell-3167417_1920.jpg` | taken |
| Home | Service cards | `useche360-ai-generated-8757611_1920.jpg`, `andrey_braynsk-man-5886567_1920.jpg`, `jandersnunes-slimming-8748460_1920.png`, `images (2).jpeg` (Online Coaching, 678 px wide) | taken |
| Home | Trainer teaser | `luissantos2020-fitness-5991125_1920.jpg` | taken (demo) |
| Home | Process background | `louisbauer-sports-1882719_1920.jpg` | taken |
| Home | Muscles preview | `iamfosna-man-7847247_1920.jpg`, `gomateyfitness-woman-9400023_1920.png`, `bdmh-man-9330135_1920.jpg` | taken |
| Programs | Top (background) | `arttower-man-4982014_1920.jpg` | placed |
| Exercises | Top (background) | `iamfosna-man-7847247_1920.jpg` (reused from the homepage muscles strip; darkened wide background here, square crop there) | placed (reuse) |
| Blog | Top (background) | `dumbbells-apples-clipboard-flat-lay.webp` (Pexels, see `IMAGE_CREDITS.md`) | stock |
| Blog + article | Progressive overload | `u_pcjeppoe5t-bodybuilder-8017875_1920.jpg` (top crop) | placed |
| Blog + article | Squat technique | `layers-sketch-4801606_1920.jpg` | placed |
| Blog + article | Fat loss | `front-view-young-female-sport-outfit-measuring-her-sizes-waist_140725-85472.avif` (top crop) | placed, low resolution |
| Blog + article | Training consistency | `hansuan_fabregas-ai-generated-8706772_1920.jpg` | placed |
| Blog + article | Sleep and recovery | `man-sleeping-dark-bedroom.webp` (Pexels, see `IMAGE_CREDITS.md`) | stock |
| Blog + article | Creatine | `supplement-powder-scoop.webp` (Pexels, see `IMAGE_CREDITS.md`) | stock |
| Blog + article | Protein | `chicken-salad-soft-boiled-eggs.webp` (Pexels, see `IMAGE_CREDITS.md`) | stock |
| About | Top (background) | `empty-gym-rig-rings.webp` (Pexels, see `IMAGE_CREDITS.md`), empty gym, no people | stock |
| About | Trainer photo | `luissantos2020-fitness-5991125_1920.jpg` (reused from the homepage teaser, crop shifted left) | taken (demo) |
| Transformations | Top (background) | `barbell-dark-gym-floor.webp` (Pexels, see `IMAGE_CREDITS.md`), equipment only, no people | stock |
| Transformations | Before and after | none, real client photos only | placeholder, see Deferred list |
| Services | Top (background) | `louisbauer-sports-1882719_1920.jpg` (reused from the homepage process background) | placed (reuse) |
| Nutrition | Top (background) | `meal-prep-chicken-rice-broccoli.webp` (Pexels, see `IMAGE_CREDITS.md`), darkened | stock |
| Exercise detail | Dumbbell Curl sidebar | `images.jpeg` | placed, small size only (662 px wide) |
| Exercise detail | Other exercises | none | missing, see Deferred list |
| Muscle chart | Intro card | `images (1).jpeg` | placed, small size only (678 px wide) |
| Muscle chart | Overview | existing `images/anatomy/muscle-groups-overview.webp` | path fixed for sub-path hosting |
| Login | Beside the form, desktop only | `marijakes-athlete-8806355_1920.jpg` | placed |
| Workout planner | Top (background) | `markusspiske-fitness-594143_1920.jpg` (darkened) | placed |
| Calculators | Top (background) | `kitchen-scale-weighing-bowl.webp` (Pexels, see `IMAGE_CREDITS.md`) | stock |
| Pricing | Top (background) | `barbell-plate-rubber-floor.webp` (Pexels, see `IMAGE_CREDITS.md`) | stock |
| All pages with a closing CTA | CTA panel (background) | `dumbbells-overhead-dark-floor.webp` (Pexels, see `IMAGE_CREDITS.md`), darkened, equipment only | stock |
| Service detail, program detail, contact, legal, 404 | none | none | no image needed |

Viewed, not placed:
- `u_40rcbxqe6b-fitness-8783745_1920.png`: abs anatomy drawing with uneven transparent edges.
- `jensenartofficial-heart-7834314_1920.jpg`: heart and barbell logo, not a photo.
- `b0red-barbell-3573104_1920.png`, `davector-fitness-10306707_1920.png`, `mcvec-sports-1975689_1920.png`: black silhouettes, vanish on the dark theme.
- `mohamed_hassan-body-builder-7320519_1920.png`: brick-pattern flexing logo.
- `images (3).jpeg`, `images (4).jpeg`: chalk and barbell, waist measure; too small.

- `Pasted image (8).png`, `(9)`, `(10)`: full-body workout infographics, not photos.
- `Pasted image (4).png`, `(16)`, `(24)`: workout infographics with other accounts' watermarks.
- `Pasted image (14).png`, `(22)`, `(26)`: muscle-group and machine-exercise infographics; no food photo for Nutrition.

- `Pasted image.png`, `(2)`, `(3)`, `(5)`, `(11)`–`(13)`, `(15)`, `(17)`–`(19)`, `(21)`, `(23)`, `(25)`, `(27)`–`(32)`, both `-removebg-preview` files, `Complete muscle group anatomy diagram.png`: workout plans, muscle-group charts and exercise sheets, several with other accounts' watermarks; all under 750 px except the anatomy diagram, which repeats the existing muscle chart overview.

Skipped by name and size: `jensenartofficial-heart-7834275_1920.jpg`, `jensenartofficial-heart-7834298_1920.jpg`, `clker-free-vector-images-strong-310874_1920.png`, `mohamed_hassan-silhouette-3378966_1920.png`, `handsome-strong-athletic-men-…-photo.jpg` (625×350).

---

## 4. Stack (fill in once)

- Angular version: 22 (zoneless, SSR and prerendering)
- Styling: SCSS; tokens in `src/styles/_tokens.scss`, breakpoints and mixins in `src/styles/_mixins.scss`
- i18n approach: `@angular/localize`
- Components: standalone, OnPush, signals
- Package manager: npm

---

## 5. Layout spec (Phase 1 target, English)

**Look:** keep the current colours and fonts. Strong, clean, gym and bodybuilding feel. Clear hierarchy, generous spacing, large readable headings, real photos of the trainer and exercises.

**Breakpoints:** 360 (small phone), 768 (tablet), 1024 (laptop), 1440 (desktop). Mobile first.

**Page frame (all pages):**
1. Header: logo, navigation, language switcher, one call-to-action button. Sticky. Mobile menu slides in.
2. Page hero or title area.
3. Content sections, each with one purpose.
4. Footer: contact, links, socials.

**Home page order (shorter version):**
1. Hero with headline, one sentence, one primary button
2. Services overview (cards)
3. How it works (short steps)
4. Trainer teaser (photo and two or three sentences)
5. Muscles and exercises preview (muscle group selector or cards, links to the full page)
6. Final call to action

Everything else lives on its own page.

**Layout rules:**
- One container width, one spacing scale, one set of section paddings, reused everywhere.
- Grid and flexbox, no fixed pixel widths for content.
- Images keep their aspect ratio, with set width and height to avoid layout jumps.
- Light motion only: scroll reveal, hover and focus states, smooth menu. Animate only `transform` and `opacity`. Respect `prefers-reduced-motion`.
- Buttons use dark text on the accent colour if the current accent is bright.

---

## 6. Deferred list (the AI appends here, one line each)

Things noticed during Phase 1 that belong to a later phase. Do not do them now.

- Missing image: homepage trainer teaser shows a stock demo photo (`luissantos2020-fitness-5991125_1920.jpg`); replace it with a well-lit portrait or half-body photo of the real trainer (4:5) before launch.
- Review before launch: the homepage Online Coaching card uses a stand-in sit-up photo (`images (2).jpeg`, 678 px wide, licence unknown); a client checking in on a phone or laptop (4:3) would fit better.
- Review before launch: the Personal Bodybuilding Coaching card uses an AI-generated photo (`useche360-ai-generated-8757611_1920.jpg`).
- Review before launch: the muscles preview photo `gomateyfitness-woman-9400023_1920.png` looks AI-generated.
- Review before launch: hero slide 2 uses an AI-generated photo (`johan_benitez99co-ai-generated-9372728_1920.png`).
- Phase 3: run `npm run i18n` and add Dutch targets for the new homepage image alt texts and hero carousel text.
- Phase 5: homepage photos are served at original size (the fat-loss PNG is 2.4 MB, hero slide 2 is 2 MB); add resized WebP/AVIF versions.
- Re-enable Dutch: add 'nl' to the language config, restore the switcher, sync NL file.
- Missing image: About, trainer photo shows the same stock demo photo as the homepage teaser; set `trainerPhotoUrl` to a real portrait of the trainer (4:5) before launch.
- Missing image: Services, top area shows a reused dumbbell photo; the coach working with a client (3:2) would fit better.
- Missing image: Transformations, cards need real client before and after photos, published with consent (3:4).
- Missing image: exercise detail pages need a demonstration photo per exercise (3:2); only Dumbbell Curl has one.
- Review before launch: blog photos `hansuan_fabregas-ai-generated-8706772_1920.jpg` (AI-generated) and `u_pcjeppoe5t-bodybuilder-8017875_1920.jpg` (looks AI-generated).
- Review before launch: confirm the licence of the fat-loss photo (`front-view-…_140725-85472.avif`, stock-site name) and replace it with a larger version; it is 626 px wide.
- Phase 3: run `npm run i18n` and add Dutch targets for the new page hero and blog image alt texts.
- Phase 4: blog display photos live in `article-card.ts`, not in `featuredImageUrl`, because `SeoService.absoluteUrl` breaks base-relative paths; fix that, then use them in article schema and social images.
- Review before launch: confirm the licence of `images.jpeg` and `images (1).jpeg` (no source in the file name) and replace them with larger versions.
- Phase 3: run `npm run i18n` and add Dutch targets for the new exercise, muscle chart and login image alt texts.
- Phase 3: run `npm run i18n` and add Dutch targets for the senior-pass strings: muscles preview sentence, About reason icons (no text), protein photo alt text, field error default label "This field".
- Phase 3: check that the desktop nav still fits at 1024 px with the longer Dutch labels (link padding is tighter below 1440 px).

---

## 7. Change log (the AI appends here, one line each)

Format: `YYYY-MM-DD | task | files`

- 2026-11-18 | Homepage images placed, anatomy figures moved to a new muscles preview | `angular.json`, `src/app/features/home/home-page.ts`, `src/app/features/home/sections/home-{hero,services,muscles}.ts`, `home-hero.scss`, `src/app/shared/ui/media-frame.ts`
- 2026-11-18 | English-only mode, Dutch disabled through `ENABLED_LANGUAGES` | `angular.json`, `src/server.ts`, `src/legacy-redirects.ts`, `src/app/core/i18n/{locales,paths}.ts`, `src/app/core/api/local-entity-repository.ts`, `src/app/layout/site-header/site-header.{ts,html}`
- 2026-11-18 | Homepage image review: new hero photo, photo strip in the muscles preview | `src/app/features/home/sections/home-{hero,muscles}.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-18 | Demo photo in the homepage trainer teaser | `src/app/features/home/sections/home-coach.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-18 | Homepage hero Bootstrap carousel, added `bootstrap` | `package.json`, `package-lock.json`, `src/bootstrap-carousel.d.ts`, `src/app/features/home/home.content.ts`, `src/app/features/home/sections/home-hero.{ts,scss}`, `PROJECT_STRUCTURE.md`
- 2026-11-18 | Hero carousel animation: image zoom, typed headline, staged sentence and button | `src/app/shared/ui/typewriter.ts`, `src/app/features/home/sections/home-hero.{ts,scss}`, `PROJECT_STRUCTURE.md`
- 2026-11-18 | Updated project guidance for the English-only phase | `CLAUDE.md`, `PROJECT_STRUCTURE.md`
- 2026-11-18 | Hero typing cursor disappears when typing ends | `src/app/shared/ui/typewriter.ts`, `src/app/features/home/sections/home-hero.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-18 | Larger text in the hero feature row | `src/app/features/home/sections/home-hero.scss`, `PROJECT_STRUCTURE.md`
- 2026-11-18 | Hero feature labels stay on one line | `src/app/features/home/sections/home-hero.scss`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Hero carousel keeps moving with the pointer on the hero; only the controls and button pause it | `src/app/features/home/sections/home-hero.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Background photo in the homepage "How coaching works" section | `src/app/features/home/sections/home-process.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Images on inner pages: optional page hero photo, Programs and Exercises heroes, four blog photos, image tracker | `src/app/shared/ui/page-hero.ts`, `src/app/shared/cards/article-card.ts`, `src/app/features/programs/programs-page.html`, `src/app/features/exercises/exercise-library-page.html`, `src/app/features/blog/article-page.{ts,html}`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Shared motion and page hero: scroll reveal for grids, hero text reveal, hero image placeholder, Pages table | `src/styles/_components.scss`, `src/app/shared/ui/page-hero.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Home: scroll reveal on the service cards | `src/app/features/home/sections/home-services.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | About: narrower photo column, capped photo size on phones and tablets, scroll reveal; trainer photo stays a placeholder | `src/app/features/about/about-page.{html,scss}`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Services: hero image placeholder, scroll reveal, icon hover | `src/app/features/services/services-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Service detail: audience and benefits side by side, scroll reveal on related programs | `src/app/features/services/service-detail-page.html`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Programs: filter columns can shrink, scroll reveal on cards | `src/app/features/programs/programs-page.{html,scss}`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Program detail: standard spacing and scroll reveal for related programs | `src/app/features/programs/program-detail-page.html`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Exercises: full-width search on tablets, safer card columns, scroll reveal | `src/app/features/exercises/exercise-library-page.{html,scss}`, `src/app/shared/cards/exercise-card.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Exercise detail: dumbbell curl photo in the sidebar, standard related section, scroll reveal | `src/app/features/exercises/exercise-detail-page.{html,scss,ts}`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Muscle chart: torso photo in the intro card, overview image path works under a sub-path | `src/app/features/muscle-chart/muscle-chart-page.{html,scss,ts}`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Nutrition: hero image placeholder, standard article heading, scroll reveal | `src/app/features/nutrition/nutrition-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Transformations: larger before and after photos on desktop, scroll reveal; no stock photos used | `src/app/features/transformations/transformations-page.{html,scss}`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Pricing: comparison labels stay visible while scrolling sideways, scroll reveal on packages | `src/app/features/pricing/pricing-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Blog: scroll reveal on cards, gentle image zoom on hover and focus | `src/app/features/blog/blog-page.ts`, `src/app/shared/cards/article-card.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Article: standard spacing and scroll reveal for related articles | `src/app/features/blog/article-page.html`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Login: athlete illustration beside the form on desktop | `src/app/features/auth/login-page.{html,scss,ts}`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Reviewed with no change needed: workout planner, calculators, contact, legal, 404 | `PROJECT_STRUCTURE.md`
- 2026-11-19 | Server no longer logs an error when a visitor cancels a page request | `src/server.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Home: photo on the Online Coaching card | `src/app/features/home/sections/home-services.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | About: demo trainer photo until a real one is set | `src/app/features/about/about-page.{ts,html}`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | About: icons on the four "How I work" steps, hover state | `src/app/features/about/about-page.{ts,html,scss}`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Fixed image `sizes` values in pixels, which made NgOptimizedImage throw (About, exercise detail, muscle chart, login, article) | `src/app/features/{about/about-page,exercises/exercise-detail-page,muscle-chart/muscle-chart-page,auth/login-page,blog/article-page}.html`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Services: hero photo (reused dumbbell photo) instead of the placeholder | `src/app/features/services/services-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Exercises: hero photo shows a lifter at the bench press instead of a dumbbell rack | `src/app/features/exercises/exercise-library-page.html`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Exercises: hero photo moved behind the text as a darkened background; page hero gained `imageBackground` | `src/app/shared/ui/page-hero.ts`, `src/app/features/exercises/exercise-library-page.html`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Workout planner: darkened dumbbell-rack photo as the hero background | `src/app/features/planner/workout-planner-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Nutrition hero: no food photo in `images/`, placeholder kept | `PROJECT_STRUCTURE.md`
- 2026-11-19 | Nutrition: downloaded Pexels meal-prep photo in the hero | `images/meal-prep-chicken-rice-broccoli.webp`, `IMAGE_CREDITS.md`, `src/app/features/nutrition/nutrition-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Calculators: downloaded Pexels kitchen-scale photo in the hero | `images/kitchen-scale-weighing-bowl.webp`, `IMAGE_CREDITS.md`, `src/app/features/nutrition/calculators-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Blog: downloaded Pexels photos for the sleep and creatine articles (cards and article pages) | `images/{man-sleeping-dark-bedroom,supplement-powder-scoop}.webp`, `IMAGE_CREDITS.md`, `src/app/shared/cards/article-card.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Calculators: hero photo moved behind the text as a darkened background | `src/app/features/nutrition/calculators-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Transformations: downloaded Pexels barbell photo as a darkened hero background (equipment only, no people) | `images/barbell-dark-gym-floor.webp`, `IMAGE_CREDITS.md`, `src/app/features/transformations/transformations-page.html`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Pricing: downloaded Pexels barbell photo as a darkened hero background | `images/barbell-plate-rubber-floor.webp`, `IMAGE_CREDITS.md`, `src/app/features/pricing/pricing-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Blog: downloaded Pexels flat lay (dumbbells, apples, clipboard) as a darkened hero background | `images/dumbbells-apples-clipboard-flat-lay.webp`, `IMAGE_CREDITS.md`, `src/app/features/blog/blog-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Blog and Exercises: category chips wrap onto new lines instead of scrolling sideways | `src/app/features/blog/blog-page.ts`, `src/app/features/exercises/exercise-library-page.scss`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Blog: choosing a category keeps the scroll position instead of jumping to the top | `src/app/features/blog/blog-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | About: method step icons in the corner opposite the number (styles were stale in the dev server); Services: hero photo moved behind the text as a darkened background | `src/app/features/services/services-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Programs: hero photo moved behind the text as a darkened background | `src/app/features/programs/programs-page.html`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | CLAUDE.md review: added the server's `$localize` passthrough import order and the admin article markup | `CLAUDE.md`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Senior pass step 1, design system: breakpoints 360/768/1024/1440, scrim, glow, chart, tracking, tap and icon-box tokens; literal colours, radii, font sizes and letter-spacing replaced; shared `.icon-tile`; 44 px touch targets; no `!important`, `::ng-deep` or inline styles left without reason | `src/styles/*`, header, footer, portal shell, about, services, nutrition, home sections, media frame, article card, planner, muscle chart, dashboard progress, admin list, `CLAUDE.md`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Senior pass step 2, layout: homepage order matches the spec (services, process, trainer, muscles), muscles intro line, step numbers from a CSS counter; fluid columns instead of fixed pixels (article, calculator, muscle chart, sidebar, footer, filters, cards); hover cue only on clickable cards; fixed CTA heading id (a counter broke SSR ids); pricing FAQ eyebrow | `src/app/features/{home,about,blog,nutrition,muscle-chart,exercises,pricing,transformations}`, `src/app/layout/site-footer`, `src/app/shared/{cards/program-card,ui/cta-section,ui/page-hero}.ts`, `src/styles/{_layout,_components}.scss`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Senior pass step 3, images: remaining local images reviewed (all infographics, none usable); downloaded Pexels chicken-and-egg bowl for the protein article; other images already fit their sections | `images/chicken-salad-soft-boiled-eggs.webp`, `IMAGE_CREDITS.md`, `src/app/shared/cards/article-card.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Senior pass step 4, icons: About "What you can expect" cards get icon tiles (target, book, message, shield); form field errors get an alert icon; method and reason icons typed as `IconName`; field error default label localised | `src/app/features/about/about-page.{ts,html,scss}`, `src/app/shared/forms/field-error.ts`, `src/styles/_components.scss`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Senior pass step 5, code quality: article page computes its image and internal link routes once (no parsing in the template); reviewed OnPush, signals, control flow, typing and subscriptions with no other change needed | `src/app/features/blog/article-page.{ts,html}`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Senior pass step 6, dead code: removed unused global classes (`.display`, `.text-accent`, `.grid--auto`), the unused Barlow 600 font file and `muscle-groups-overview-640.webp`; unused files in `images/` (PDFs, infographics, silhouettes, logos) are excluded from the build in `angular.json` but kept on disk; no unused components, services or packages found | `src/styles/{_typography,_layout,_fonts}.scss`, `public/fonts/barlow-condensed-latin-600.woff2` (deleted), `public/images/anatomy/muscle-groups-overview-640.webp` (deleted), `angular.json`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Senior pass step 7, performance: deferred hydration (`@defer (hydrate on viewport)`) for every closing CTA, both FAQ lists, the muscle-chart split table and the homepage coach teaser; routes already lazy, fonts self-hosted with two preloads, Barlow 600 dropped | `src/app/features/{home,about,blog,muscle-chart,nutrition,pricing,programs,services,transformations}/*`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Senior pass step 8, review by reading: TypeScript and template diffs, inline Sass `@use`, selector order and translation markers checked; pricing label widths in rem; project map and key locations filled in | `src/app/features/pricing/pricing-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | About: downloaded Pexels empty-gym photo as a darkened hero background (no people, so it does not pose as the trainer); bio photo no longer marked priority | `images/empty-gym-rig-rings.webp`, `IMAGE_CREDITS.md`, `src/app/features/about/about-page.html`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Nutrition: meal-prep hero photo moved behind the text as a darkened background (alt text dropped, the photo is now decorative) | `src/app/features/nutrition/nutrition-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Pricing: shows the first 4 active packages by order (one row on desktop); cards, comparison table and offer schema use the same list; Contest Prep (order 5) stays in the data, contact form and service page | `src/app/features/pricing/pricing-page.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Shared CTA panel: downloaded Pexels overhead dumbbell photo as a darkened background, darkest behind the centred text | `images/dumbbells-overhead-dark-floor.webp`, `IMAGE_CREDITS.md`, `src/app/shared/ui/cta-section.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Fixed CTA photo `sizes` in pixels, which made NgOptimizedImage throw (NG02952) | `src/app/shared/ui/cta-section.ts`, `PROJECT_STRUCTURE.md`
- 2026-11-19 | Floating back-to-top button: appears after 300 px of scrolling, stacked above the WhatsApp button, hidden while the mobile menu is open; removed the button from the footer; more footer bottom space on phones | `src/app/shared/ui/scroll-top-button.ts` (new), `src/app/layout/public-layout.ts`, `src/app/layout/site-footer/site-footer.{html,ts,scss}`, `PROJECT_STRUCTURE.md`

---

## 8. Roadmap

| Phase | Focus | Status |
|---|---|---|
| 1 | English layout and visual style | **Current** |
| 2 | Clean code, SOLID, remove duplication and dead code | **Current** (runs together with the senior layout pass) |
| 3 | Dutch version (sync with the Deferred list) | Later |
| 4 | SEO: titles, meta, hreflang, schema, sitemap, humanized text (files 01 and 02) | Later |
| 5 | Performance and accessibility pass | Later |
| 6 | Testing (by me) | Later |

When I say "start Phase N", switch to that phase, update the status table, and follow that phase's rules.

---

## 9. Prompt to start every session

```text
Read PROJECT_STRUCTURE.md first and follow it. Do not scan the project. Do only the task below, nothing else. No testing, no extra suggestions. Reply in 5 lines or fewer, log the change, and stop.

TASK: [your instruction]
```
