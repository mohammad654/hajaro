import { RenderMode, ServerRoute } from '@angular/ssr';
import { ARTICLES } from './core/data/articles.data';
import { EXERCISES } from './core/data/exercises.data';
import { PROGRAMS } from './core/data/programs.data';
import { SERVICES } from './core/data/services.data';
import { ARTICLE_CATEGORY_LABELS } from './core/models';
import { CURRENT_LOCALE, lp } from './core/i18n/current-locale';
import { localizeSegment } from './core/i18n/paths';

/**
 * Rendering strategy:
 * - Public marketing and content pages are prerendered (static HTML at build time) for SEO and speed.
 *   Unknown slugs fall back to on-demand server rendering, which returns a real 404 status.
 * - Authenticated areas render on the client only (no private data in server HTML).
 * Paths are canonical and translated per language with `lp()`, exactly like app.routes.ts.
 */
const publicSlug = (slug: string) => localizeSegment(slug, CURRENT_LOCALE.code);
const slugs = (items: readonly { slug: string }[]) => async () =>
  items.map((item) => ({ slug: publicSlug(item.slug) }));

const STATIC_PAGES = [
  '',
  'about',
  'services',
  'programs',
  'exercises',
  'muscle-chart',
  'workout-planner',
  'nutrition',
  'nutrition/calculators',
  'transformations',
  'pricing',
  'blog',
  'contact',
  'privacy',
  'terms',
  'disclaimer',
];

/** Friendly aliases: permanent (301) redirects to the canonical page. */
const REDIRECTS = ['coaching', 'plans', 'anatomy', 'workout-chart', 'calculators'];

export const serverRoutes: ServerRoute[] = [
  ...STATIC_PAGES.map((path): ServerRoute => ({
    path: lp(path),
    renderMode: RenderMode.Prerender,
  })),
  ...REDIRECTS.map((path): ServerRoute => ({
    path: lp(path),
    renderMode: RenderMode.Server,
    status: 301,
  })),
  {
    path: lp('services/:slug'),
    renderMode: RenderMode.Prerender,
    getPrerenderParams: slugs(SERVICES),
  },
  {
    path: lp('programs/:slug'),
    renderMode: RenderMode.Prerender,
    getPrerenderParams: slugs(PROGRAMS),
  },
  {
    path: lp('exercises/:slug'),
    renderMode: RenderMode.Prerender,
    getPrerenderParams: slugs(EXERCISES),
  },
  {
    path: lp('blog/:slug'),
    renderMode: RenderMode.Prerender,
    getPrerenderParams: slugs(ARTICLES.filter((a) => a.published)),
  },
  {
    path: lp('blog/category/:category'),
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      Object.keys(ARTICLE_CATEGORY_LABELS).map((category) => ({ category: publicSlug(category) })),
  },
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'dashboard/**', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },
  { path: 'dashboard', renderMode: RenderMode.Client },
  { path: 'admin', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Server,
    status: 404,
    headers: { 'Cache-Control': 'no-cache' },
  },
];
