import { LANGUAGE_COOKIE, SITE_LOCALES, localeByCode } from './app/core/i18n/locales';
import { canonicalPath, localeUrl, localizePath } from './app/core/i18n/paths';

/**
 * While Dutch is disabled: Dutch URLs and language-prefixed URLs → the same page in English.
 * Served as a temporary redirect so browsers do not keep it after Dutch is enabled again.
 */
export function disabledLanguageRedirect(path: string): string | null {
  if (SITE_LOCALES.some((l) => l.code === 'nl') || /\.[a-z0-9]{2,5}$/i.test(path)) return null;

  const prefixed = path.match(/^\/(?:nl|en)(\/.*)?$/);
  const target = localizePath(canonicalPath(prefixed ? prefixed[1] || '/' : path, 'nl'), 'en');
  return target === path ? null : target;
}

/**
 * Permanent redirects for URLs of the earlier site structure:
 *   - English at the root with English slugs ('/about', '/services/online-personal-training')
 *   - Dutch under /nl/ with English slugs ('/nl/services')
 * Returns the new URL, or null when the path is current (or unknown: the app answers with a 404).
 */
export function legacyRedirect(path: string): string | null {
  if (/\.[a-z0-9]{2,5}$/i.test(path)) return null;

  const dutch = SITE_LOCALES.find((l) => l.code === 'nl');
  const english = SITE_LOCALES.find((l) => l.code === 'en');
  if (!dutch || !english) return null;

  if (path === '/nl' || path.startsWith('/nl/')) {
    return localeUrl(path.slice(3) || '/', dutch);
  }
  if (path === english.prefix || path.startsWith(`${english.prefix}/`)) return null;

  // An old English URL is a canonical path whose Dutch URL is different; a path that is the same in
  // both (e.g. '/contact', '/blog/<slug>') is already a valid Dutch URL.
  if (localizePath(path, 'nl') === path) return null;
  return localeUrl(path, english);
}

/**
 * Where to send a visitor who opens the bare root URL, based on the language they picked earlier
 * in the switcher. Crawlers send no cookies and always get the default language.
 */
export function rememberedLanguageRedirect(cookieHeader: string | undefined): string | null {
  const code = cookieHeader?.match(new RegExp(`(?:^|;\\s*)${LANGUAGE_COOKIE}=([a-z]{2})`))?.[1];
  if (!code) return null;
  const locale = localeByCode(code);
  return locale.code === code && locale.prefix ? `${locale.prefix}/` : null;
}
