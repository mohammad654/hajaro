import { Pipe, PipeTransform } from '@angular/core';
import { SiteLocale, localeByCode } from './locales';
import { canonicalPath, canonicalSegment, localizePath } from './paths';

/**
 * The language this bundle was compiled for. `$localize` is replaced at build time (the Dutch
 * build gets "nl" from src/locale/messages.nl.xlf), so this is a constant — safe at module level,
 * in route definitions and on a server that has every language loaded.
 */
export const CURRENT_LOCALE: SiteLocale = localeByCode($localize`:@@build.locale:en`);

/** Canonical app path → path in the current language (router paths, links). */
export function lp(canonical: string): string {
  return localizePath(canonical, CURRENT_LOCALE.code);
}

/** Current-language public path (e.g. router.url) → canonical app path. */
export function toCanonical(publicPath: string): string {
  return canonicalPath(publicPath, CURRENT_LOCALE.code);
}

/**
 * Translates canonical link targets for routerLink:
 * `[routerLink]="'/services' | localePath"`, `[routerLink]="['/services', s.slug] | localePath"`.
 * Relative targets (`[]`, 'edit') are returned unchanged.
 */
@Pipe({ name: 'localePath' })
export class LocalePathPipe implements PipeTransform {
  transform(target: string | readonly unknown[]): string | readonly unknown[] {
    if (typeof target === 'string') return target.startsWith('/') ? lp(target) : target;
    const [first] = target;
    if (typeof first !== 'string' || !first.startsWith('/')) return target;
    return lp(target.map(String).join('/').replace(/\/{2,}/g, '/'));
  }
}

/** Public URL segment in the current language (e.g. a route param) → canonical slug. */
export function canonicalSlug(publicSlug: string): string {
  return canonicalSegment(publicSlug, CURRENT_LOCALE.code);
}
