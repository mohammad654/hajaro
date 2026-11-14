import { RenderMode, ServerRoute } from '@angular/ssr';
import { ARTICLES } from './core/data/articles.data';
import { EXERCISES } from './core/data/exercises.data';
import { PROGRAMS } from './core/data/programs.data';
import { SERVICES } from './core/data/services.data';
import { ARTICLE_CATEGORY_LABELS } from './core/models';

/**
 * Rendering strategy:
 * - Public marketing and content pages are prerendered (static HTML at build time) for SEO and speed.
 *   Unknown slugs fall back to on-demand server rendering, which returns a real 404 status.
 * - Authenticated areas render on the client only (no private data in server HTML).
 */
const slugs = (items: readonly { slug: string }[]) => async () =>
  items.map((item) => ({ slug: item.slug }));

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

/** Legacy / friendly aliases — answered with an HTTP redirect by the server. */
const REDIRECTS = ['coaching', 'plans', 'anatomy', 'workout-chart', 'calculators'];

export const serverRoutes: ServerRoute[] = [
  ...STATIC_PAGES.map((path): ServerRoute => ({ path, renderMode: RenderMode.Prerender })),
  ...REDIRECTS.map((path): ServerRoute => ({ path, renderMode: RenderMode.Server })),
  { path: 'services/:slug', renderMode: RenderMode.Prerender, getPrerenderParams: slugs(SERVICES) },
  { path: 'programs/:slug', renderMode: RenderMode.Prerender, getPrerenderParams: slugs(PROGRAMS) },
  {
    path: 'exercises/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: slugs(EXERCISES),
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: slugs(ARTICLES.filter((a) => a.published)),
  },
  {
    path: 'blog/category/:category',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      Object.keys(ARTICLE_CATEGORY_LABELS).map((category) => ({ category })),
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
