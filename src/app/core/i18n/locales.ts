import { LOCALE_ID, inject } from '@angular/core';

export interface SiteLocale {
  /** BCP 47 language code — matches the locale codes in angular.json → i18n. */
  readonly code: 'en' | 'nl';
  /** URL prefix — matches `subPath` in angular.json ('' = served from the site root). */
  readonly prefix: '' | `/${string}`;
  /** Name of the language in that language (shown in the switcher). */
  readonly name: string;
  /** Open Graph locale (language_TERRITORY). */
  readonly ogLocale: string;
}

/**
 * Languages the site is built in. Each one is a separate, fully translated build
 * (`ng build` with `localize: true`), so no translation is ever downloaded or evaluated at runtime.
 * KEEP IN SYNC with angular.json → projects.hajaro.i18n.
 */
export const SITE_LOCALES: readonly SiteLocale[] = [
  { code: 'en', prefix: '', name: 'English', ogLocale: 'en_GB' },
  { code: 'nl', prefix: '/nl', name: 'Nederlands', ogLocale: 'nl_NL' },
];

export const DEFAULT_LOCALE: SiteLocale = SITE_LOCALES[0];

/** Maps a LOCALE_ID ('nl', 'en-US', …) to a site locale; unknown ids fall back to the default. */
export function resolveLocale(localeId: string): SiteLocale {
  const language = localeId.toLowerCase().split('-')[0];
  return SITE_LOCALES.find((l) => l.code === language) ?? DEFAULT_LOCALE;
}

/** The locale this bundle was compiled for. Must be called in an injection context. */
export function injectSiteLocale(): SiteLocale {
  return resolveLocale(inject(LOCALE_ID));
}

/**
 * Root-relative URL of an app path (as the router sees it, without locale prefix) in `locale`.
 * `localizedPath(nl, '/about')` → '/nl/about'; `localizedPath(nl, '/')` → '/nl/'.
 */
export function localizedPath(locale: SiteLocale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${locale.prefix}${clean}`;
}
