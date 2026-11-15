import { ChangeDetectionStrategy, Component } from '@angular/core';
import { applyPageSeo } from '../../core/seo/page-seo';
import { CtaSection } from '../../shared/ui/cta-section';
import { HomeCoach } from './sections/home-coach';
import { HomeHero } from './sections/home-hero';
import { HomeProcess } from './sections/home-process';
import { HomeServices } from './sections/home-services';

/**
 * Short first-visit page: hero, trainer teaser, services overview, how coaching works and one
 * closing call to action. Everything else lives on its own page (programs, results, pricing, blog,
 * FAQ on the services page) and is reachable from the navigation.
 */
@Component({
  selector: 'app-home-page',
  imports: [HomeHero, HomeCoach, HomeServices, HomeProcess, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-home-hero />
    <app-home-coach />
    <app-home-services />

    @defer (hydrate on viewport) {
      <app-home-process />
    }

    <app-cta-section />
  `,
})
export class HomePage {
  constructor() {
    applyPageSeo('home', {
      title: $localize`Personal Trainer & Bodybuilding Coach`,
      description: $localize`Strength training and bodybuilding coaching, in person and online. Clear plans, honest feedback, steady progress. Book a free intro.`,
      path: '/',
    });
  }
}
