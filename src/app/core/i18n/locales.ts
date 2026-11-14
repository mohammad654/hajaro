export type LocaleCode = 'nl' | 'en';

export interface SiteLocale {
  /** BCP 47 language code — matches the locale codes in angular.json → i18n. */
  readonly code: LocaleCode;
  /** URL prefix — matches `subPath` in angular.json ('' = served from the site root). */
  readonly prefix: '' | `/${string}`;
  /** Name of the language in that language (shown in the switcher). */
  readonly name: string;
  /** Open Graph locale (language_TERRITORY). */
  readonly ogLocale: string;
}

/**
 * Languages the site is built in, default first. Each one is a separate, fully translated build
 * (`ng build` with `localize: true`), so no translation is downloaded or evaluated at runtime.
 * KEEP IN SYNC with angular.json → projects.hajaro.i18n.
 *
 * Plain data only (no $localize): this file is also used by the Express server.
 */
export const SITE_LOCALES: readonly SiteLocale[] = [
  { code: 'nl', prefix: '', name: 'Nederlands', ogLocale: 'nl_NL' },
  { code: 'en', prefix: '/en', name: 'English', ogLocale: 'en_GB' },
];

/** Name of the cookie that remembers the language a visitor picked in the switcher. */
export const LANGUAGE_COOKIE = 'lang';

/** Served from the site root and used as hreflang x-default. */
export const DEFAULT_LOCALE: SiteLocale = SITE_LOCALES[0];

export function localeByCode(code: string): SiteLocale {
  return SITE_LOCALES.find((l) => l.code === code) ?? DEFAULT_LOCALE;
}
