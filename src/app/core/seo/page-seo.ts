import { inject } from '@angular/core';
import { SiteContentStore } from '../data-access/site-content.store';
import { PageMeta, SeoService } from './seo.service';

/**
 * Applies SEO metadata for a static page. Title/description can be overridden by the trainer
 * in Admin → Site content → SEO using the same `key`. Must run in an injection context.
 */
export function applyPageSeo(key: string, defaults: PageMeta): void {
  const override = inject(SiteContentStore).content().seo[key];
  inject(SeoService).update({
    ...defaults,
    ...(override?.title ? { title: override.title } : {}),
    ...(override?.description ? { description: override.description } : {}),
  });
}
