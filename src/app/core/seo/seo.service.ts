import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SITE_CONFIG } from '../config/site.config';
import { DEFAULT_LOCALE, SITE_LOCALES, injectSiteLocale, localizedPath } from '../i18n/locales';

export interface PageMeta {
  readonly title: string;
  readonly description: string;
  /** Canonical path. Defaults to the current router URL without query string or fragment. */
  readonly path?: string;
  readonly image?: string;
  readonly imageAlt?: string;
  readonly type?: 'website' | 'article' | 'profile';
  readonly noindex?: boolean;
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
}

type JsonLd = Record<string, unknown>;

/**
 * Owns every SEO-relevant tag in <head>: title, description, canonical, robots,
 * Open Graph, Twitter cards, hreflang alternates and JSON-LD structured data.
 * Works identically during SSR/prerendering. URLs are always built for the language of this build.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly pageSchemaKeys = new Set<string>();
  private readonly locale = injectSiteLocale();

  constructor() {
    const verification = environment.analytics.searchConsoleVerification;
    if (verification)
      this.meta.updateTag({ name: 'google-site-verification', content: verification });

    // Page-level structured data belongs to a single page; clear it before the next page renders.
    this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      this.pageSchemaKeys.forEach((key) => this.removeSchema(key));
      this.pageSchemaKeys.clear();
    });
  }

  update(page: PageMeta): void {
    const fullTitle = page.title.includes(SITE_CONFIG.brandName)
      ? page.title
      : `${page.title} | ${SITE_CONFIG.brandName} ${SITE_CONFIG.brandSuffix}`;
    const path = page.path ?? this.currentPath();
    const url = this.absoluteUrl(path);
    const image = this.absoluteUrl(page.image ?? SITE_CONFIG.defaultOgImage);

    this.title.setTitle(fullTitle);
    this.setName('description', page.description);
    this.setName(
      'robots',
      page.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    );
    this.setCanonical(url);
    this.setAlternates(page.noindex ? null : path);

    this.setProperty('og:site_name', `${SITE_CONFIG.brandName} ${SITE_CONFIG.brandSuffix}`);
    this.setProperty('og:locale', this.locale.ogLocale);
    this.setProperty('og:type', page.type ?? 'website');
    this.setProperty('og:title', fullTitle);
    this.setProperty('og:description', page.description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', image);
    this.setProperty('og:image:alt', page.imageAlt ?? fullTitle);
    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', fullTitle);
    this.setName('twitter:description', page.description);
    this.setName('twitter:image', image);

    if (page.publishedTime) this.setProperty('article:published_time', page.publishedTime);
    else this.meta.removeTag("property='article:published_time'");
    if (page.modifiedTime) this.setProperty('article:modified_time', page.modifiedTime);
    else this.meta.removeTag("property='article:modified_time'");
  }

  /** Adds structured data scoped to the current page (removed automatically on navigation). */
  setPageSchema(key: string, data: JsonLd): void {
    this.pageSchemaKeys.add(key);
    this.setSchema(key, data);
  }

  /** Adds site-wide structured data (Organization, WebSite, Person). */
  setGlobalSchema(key: string, data: JsonLd): void {
    this.setSchema(key, data);
  }

  /** Absolute URL of an app path (or public asset) in the current language, e.g. '/about' → 'https://…/nl/about'. */
  absoluteUrl(path: string, locale = this.locale): string {
    if (/^https?:\/\//.test(path)) return path;
    return `${this.origin}${localizedPath(locale, path)}`;
  }

  private get origin(): string {
    return environment.siteUrl.replace(/\/$/, '');
  }

  /**
   * <link rel="alternate" hreflang> for every language plus x-default, so search engines show
   * visitors the right language and don't treat translations as duplicate content.
   */
  private setAlternates(path: string | null): void {
    this.document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((l) => l.remove());
    if (path === null) return;
    const entries: [string, string][] = [
      ...SITE_LOCALES.map((l): [string, string] => [l.code, this.absoluteUrl(path, l)]),
      ['x-default', this.absoluteUrl(path, DEFAULT_LOCALE)],
    ];
    for (const [hreflang, href] of entries) {
      const link = this.document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hreflang;
      link.href = href;
      this.document.head.appendChild(link);
    }
  }

  private currentPath(): string {
    const path = this.router.url.split(/[?#]/)[0] || '/';
    return path === '' ? '/' : path;
  }

  private setSchema(key: string, data: JsonLd): void {
    const selector = `script[type="application/ld+json"][data-schema="${key}"]`;
    let script = this.document.head.querySelector<HTMLScriptElement>(selector);
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', key);
      this.document.head.appendChild(script);
    }
    // Escape "<" so content can never close the script element.
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(
      /</g,
      '\\u003c',
    );
  }

  private removeSchema(key: string): void {
    this.document.head.querySelector(`script[data-schema="${key}"]`)?.remove();
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }
}
