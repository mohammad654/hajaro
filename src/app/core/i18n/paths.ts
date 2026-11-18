import { ALL_LOCALES, LocaleCode, SiteLocale } from './locales';

/**
 * Public URL segments per language.
 *
 * Code always works with canonical paths (the keys below, e.g. '/services/online-personal-training').
 * They are translated to public URLs only at the edges: route config, routerLink (`localePath` pipe),
 * canonical/hreflang tags, the sitemap and the language switcher. Segments that are not listed are
 * the same in every language (slugs of exercises, programs and articles, '/contact', '/blog', …).
 *
 * Adding a translated URL = adding one entry here. Old URLs are redirected by the server.
 * Plain data only (no $localize): this file is also used by the Express server.
 */
const SEGMENTS: Readonly<Record<string, Partial<Record<LocaleCode, string>>>> = {
  // Sections
  about: { nl: 'over-mij' },
  services: { nl: 'diensten' },
  programs: { nl: 'trainingsschemas' },
  exercises: { nl: 'oefeningen' },
  'muscle-chart': { nl: 'spierkaart' },
  'workout-planner': { nl: 'trainingsplanner' },
  nutrition: { nl: 'voeding' },
  transformations: { en: 'results', nl: 'resultaten' },
  pricing: { nl: 'tarieven' },
  category: { nl: 'categorie' },
  terms: { nl: 'voorwaarden' },

  // Services
  'personal-bodybuilding-coaching': { nl: 'persoonlijke-bodybuilding-coaching' },
  'muscle-building-programs': { nl: 'spieropbouw-programmas' },
  'fat-loss-coaching': { nl: 'vetverlies-coaching' },
  'body-recomposition': { nl: 'body-recompositie' },
  'strength-development': { nl: 'krachtopbouw' },
  'beginner-bodybuilding': { nl: 'bodybuilding-voor-beginners' },
  'advanced-bodybuilding': { nl: 'bodybuilding-voor-gevorderden' },
  'online-personal-training': { en: 'online-coaching', nl: 'online-coaching' },
  'in-person-personal-training': { en: 'personal-training', nl: 'personal-training' },
  'competition-preparation': { en: 'contest-prep', nl: 'wedstrijdvoorbereiding' },
  'posing-coaching': { nl: 'poseercoaching' },

  // Blog categories ('nutrition' is shared with the section above)
  'muscle-growth': { nl: 'spiergroei' },
  'strength-training': { nl: 'krachttraining' },
  'fat-loss': { nl: 'vetverlies' },
  'exercise-technique': { nl: 'oefentechniek' },
  recovery: { nl: 'herstel' },
  supplements: { nl: 'supplementen' },
  motivation: { nl: 'motivatie' },
};

/** public segment → canonical segment, per language. Throws on ambiguous tables (fails the build). */
const REVERSE: Readonly<Record<LocaleCode, ReadonlyMap<string, string>>> = (() => {
  const result = {} as Record<LocaleCode, Map<string, string>>;
  for (const { code } of ALL_LOCALES) {
    const map = new Map<string, string>();
    for (const canonical of Object.keys(SEGMENTS)) {
      const local = localizeSegment(canonical, code);
      const clash = map.get(local) ?? (local !== canonical && local in SEGMENTS ? local : null);
      if (clash !== null && clash !== canonical) {
        throw new Error(
          `URL segment "${local}" (${code}) is used for "${canonical}" and "${clash}"`,
        );
      }
      map.set(local, canonical);
    }
    result[code] = map;
  }
  return result;
})();

export function localizeSegment(canonical: string, locale: LocaleCode): string {
  return SEGMENTS[canonical]?.[locale] ?? canonical;
}

export function canonicalSegment(segment: string, locale: LocaleCode): string {
  return REVERSE[locale].get(segment) ?? segment;
}

const mapSegments = (path: string, fn: (segment: string) => string) =>
  path
    .split('/')
    .map((segment) => (segment && !segment.startsWith(':') ? fn(segment) : segment))
    .join('/');

/**
 * Canonical app path → path of the same page in `locale`, without the language prefix
 * (what the router and routerLink use inside that language's build).
 * '/services/online-personal-training' → nl '/diensten/online-coaching'. Also maps route patterns
 * ('services/:slug' → 'diensten/:slug'). Query strings and fragments are kept.
 */
export function localizePath(canonical: string, locale: LocaleCode): string {
  const [path, rest = ''] = splitSuffix(canonical);
  return mapSegments(path, (s) => localizeSegment(s, locale)) + rest;
}

/** Public path in `locale` (without language prefix) → canonical app path. */
export function canonicalPath(publicPath: string, locale: LocaleCode): string {
  const [path, rest = ''] = splitSuffix(publicPath);
  return mapSegments(path, (s) => canonicalSegment(s, locale)) + rest;
}

/** Root-relative URL of a canonical path in `locale`, including the language prefix. */
export function localeUrl(canonical: string, locale: SiteLocale): string {
  const path = localizePath(canonical.startsWith('/') ? canonical : `/${canonical}`, locale.code);
  return locale.prefix && path === '/' ? `${locale.prefix}/` : `${locale.prefix}${path}`;
}

function splitSuffix(path: string): [string, string?] {
  const index = path.search(/[?#]/);
  return index === -1 ? [path] : [path.slice(0, index), path.slice(index)];
}
