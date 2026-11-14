import { ChangeDetectionStrategy, Component, afterNextRender, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteContentStore } from './core/data-access/site-content.store';
import { AnalyticsService } from './core/services/analytics.service';
import { SeoService } from './core/seo/seo.service';
import { organizationSchema, personSchema, websiteSchema } from './core/seo/schema.builders';
import { ConsentBanner } from './shared/ui/consent-banner';
import { SkipLink } from './shared/ui/skip-link';
import { ToastOutlet } from './shared/ui/toast-outlet';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastOutlet, SkipLink, ConsentBanner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-skip-link target="main" />
    <router-outlet />
    <app-toast-outlet />
    <app-consent-banner />
  `,
})
export class App {
  constructor() {
    const seo = inject(SeoService);
    const content = inject(SiteContentStore).content;
    const abs = (path: string) => seo.absoluteUrl(path);

    seo.setGlobalSchema('organization', organizationSchema(abs));
    seo.setGlobalSchema('website', websiteSchema(abs));
    effect(() => seo.setGlobalSchema('person', personSchema(abs, content())));

    const analytics = inject(AnalyticsService);
    afterNextRender(() => analytics.init());
  }
}
