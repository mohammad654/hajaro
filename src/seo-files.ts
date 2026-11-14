import { environment } from './environments/environment';
import { ARTICLES } from './app/core/data/articles.data';
import { EXERCISES } from './app/core/data/exercises.data';
import { PROGRAMS } from './app/core/data/programs.data';
import { SERVICES } from './app/core/data/services.data';
import { ARTICLE_CATEGORY_LABELS } from './app/core/models';
import { DEFAULT_LOCALE, SITE_LOCALES, localizedPath } from './app/core/i18n/locales';

interface SitemapEntry {
  readonly path: string;
  readonly priority: number;
  readonly changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  readonly lastmod?: string;
}

const STATIC_ENTRIES: readonly SitemapEntry[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/services', priority: 0.9, changefreq: 'monthly' },
  { path: '/programs', priority: 0.9, changefreq: 'weekly' },
  { path: '/pricing', priority: 0.9, changefreq: 'monthly' },
  { path: '/muscle-chart', priority: 0.8, changefreq: 'monthly' },
  { path: '/exercises', priority: 0.8, changefreq: 'weekly' },
  { path: '/workout-planner', priority: 0.6, changefreq: 'monthly' },
  { path: '/nutrition', priority: 0.7, changefreq: 'monthly' },
  { path: '/nutrition/calculators', priority: 0.7, changefreq: 'monthly' },
  { path: '/transformations', priority: 0.7, changefreq: 'weekly' },
  { path: '/blog', priority: 0.8, changefreq: 'daily' },
  { path: '/contact', priority: 0.8, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.2, changefreq: 'yearly' },
  { path: '/terms', priority: 0.2, changefreq: 'yearly' },
  { path: '/disclaimer', priority: 0.2, changefreq: 'yearly' },
];

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const origin = () => environment.siteUrl.replace(/\/$/, '');

/** XML sitemap generated from the same content data the app renders — always in sync. */
export function buildSitemap(): string {
  const published = ARTICLES.filter((a) => a.published);
  const entries: SitemapEntry[] = [
    ...STATIC_ENTRIES,
    ...SERVICES.map((s) => ({
      path: `/services/${s.slug}`,
      priority: 0.8,
      changefreq: 'monthly' as const,
    })),
    ...PROGRAMS.map((p) => ({
      path: `/programs/${p.slug}`,
      priority: 0.8,
      changefreq: 'monthly' as const,
    })),
    ...EXERCISES.map((e) => ({
      path: `/exercises/${e.slug}`,
      priority: 0.6,
      changefreq: 'monthly' as const,
    })),
    ...published.map((a) => ({
      path: `/blog/${a.slug}`,
      priority: 0.7,
      changefreq: 'monthly' as const,
      lastmod: a.updatedAt,
    })),
    ...Object.keys(ARTICLE_CATEGORY_LABELS)
      .filter((c) => published.some((a) => a.category === c))
      .map((c) => ({ path: `/blog/category/${c}`, priority: 0.5, changefreq: 'weekly' as const })),
  ];

  // Every page exists in every language; each <url> lists all of its translations (hreflang).
  const href = (locale: (typeof SITE_LOCALES)[number], path: string) =>
    escapeXml(origin() + localizedPath(locale, path));
  const urls = entries
    .flatMap((e) => {
      const alternates = [
        ...SITE_LOCALES.map(
          (l) => `<xhtml:link rel="alternate" hreflang="${l.code}" href="${href(l, e.path)}"/>`,
        ),
        `<xhtml:link rel="alternate" hreflang="x-default" href="${href(DEFAULT_LOCALE, e.path)}"/>`,
      ].join('');
      return SITE_LOCALES.map(
        (l) =>
          `  <url><loc>${href(l, e.path)}</loc>${alternates}${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}<changefreq>${e.changefreq}</changefreq><priority>${e.priority.toFixed(1)}</priority></url>`,
      );
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}

export function buildRobots(): string {
  return [
    'User-agent: *',
    'Allow: /',
    ...SITE_LOCALES.flatMap((l) =>
      ['/dashboard', '/admin', '/login'].map((path) => `Disallow: ${localizedPath(l, path)}`),
    ),
    '',
    `Sitemap: ${origin()}/sitemap.xml`,
    '',
  ].join('\n');
}
