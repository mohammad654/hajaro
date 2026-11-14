import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleStore } from '../../core/data-access/article.store';
import { PackageStore } from '../../core/data-access/package.store';
import { GENERAL_FAQS } from '../../core/data/faqs.data';
import { applyPageSeo } from '../../core/seo/page-seo';
import { ArticleCard } from '../../shared/cards/article-card';
import { PackageCard } from '../../shared/cards/package-card';
import { CtaSection } from '../../shared/ui/cta-section';
import { FaqList } from '../../shared/ui/faq-list';
import { HomeCoach } from './sections/home-coach';
import { HomeHero } from './sections/home-hero';
import { HomeProcess } from './sections/home-process';
import { HomePrograms } from './sections/home-programs';
import { HomeResults } from './sections/home-results';
import { HomeServices } from './sections/home-services';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-home-page',
  imports: [
    LocalePathPipe,
    RouterLink,
    HomeHero,
    HomeCoach,
    HomeServices,
    HomePrograms,
    HomeResults,
    HomeProcess,
    ArticleCard,
    PackageCard,
    FaqList,
    CtaSection,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-home-hero />
    <app-home-coach />
    <app-home-services />

    @defer (hydrate on viewport) {
      <app-home-programs />
    }
    @defer (hydrate on viewport) {
      <app-home-results />
    }
    @defer (hydrate on viewport) {
      <app-home-process />
    }

    @defer (hydrate on viewport) {
      <section class="section" aria-labelledby="pricing-title">
        <div class="container">
          <div class="section-head section-head--center">
            <p class="eyebrow" i18n>Pricing</p>
            <h2 id="pricing-title" i18n>Coaching packages</h2>
            <p i18n>Clear prices from the start. Pick a package, or ask me which one fits.</p>
          </div>
          <div class="grid grid--3">
            @for (pkg of packages.active().slice(0, 3); track pkg.id) {
              <app-package-card [pkg]="pkg" />
            }
          </div>
          <p class="section-foot">
            <a [routerLink]="'/pricing' | localePath" class="link-arrow" i18n
              >Compare all packages</a
            >
          </p>
        </div>
      </section>
    }

    @defer (hydrate on viewport) {
      <section class="section section--alt" aria-labelledby="articles-title">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow" i18n>Blog</p>
            <h2 id="articles-title" i18n>Articles on training and food</h2>
            <p i18n>
              Practical articles on strength training, building muscle and eating for performance.
            </p>
          </div>
          <div class="grid grid--3">
            @for (article of articles.featured().slice(0, 3); track article.id) {
              <app-article-card [article]="article" />
            }
          </div>
          <p class="section-foot">
            <a [routerLink]="'/blog' | localePath" class="link-arrow" i18n>Read the blog</a>
          </p>
        </div>
      </section>
    }

    @defer (hydrate on viewport) {
      <section class="section" aria-labelledby="faq-title">
        <div class="container container--narrow">
          <div class="section-head section-head--center">
            <p class="eyebrow" i18n>FAQ</p>
            <h2 id="faq-title" i18n>Frequently asked questions</h2>
          </div>
          <app-faq-list [items]="faqs" />
        </div>
      </section>
    }

    <app-cta-section />
  `,
  styles: `
    .section-foot {
      margin-top: var(--sp-6);
      text-align: center;
    }
  `,
})
export class HomePage {
  protected readonly packages = inject(PackageStore);
  protected readonly articles = inject(ArticleStore);
  protected readonly faqs = GENERAL_FAQS;

  constructor() {
    applyPageSeo('home', {
      title: $localize`Personal Trainer & Bodybuilding Coach`,
      description: $localize`Strength training and bodybuilding coaching, in person and online. Clear plans, honest feedback, steady progress. Book a free intro.`,
      path: '/',
    });
  }
}
