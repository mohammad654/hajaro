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

@Component({
  selector: 'app-home-page',
  imports: [
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
            <p class="eyebrow">Pricing</p>
            <h2 id="pricing-title">Transparent coaching packages</h2>
            <p>No hidden fees. Choose the level of support that matches your goals.</p>
          </div>
          <div class="grid grid--3">
            @for (pkg of packages.active().slice(0, 3); track pkg.id) {
              <app-package-card [pkg]="pkg" />
            }
          </div>
          <p class="section-foot">
            <a routerLink="/pricing" class="link-arrow">Compare all packages</a>
          </p>
        </div>
      </section>
    }

    @defer (hydrate on viewport) {
      <section class="section section--alt" aria-labelledby="articles-title">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">Learn</p>
            <h2 id="articles-title">Training & nutrition education</h2>
            <p>Practical, evidence-based articles to help you train smarter.</p>
          </div>
          <div class="grid grid--3">
            @for (article of articles.featured().slice(0, 3); track article.id) {
              <app-article-card [article]="article" />
            }
          </div>
          <p class="section-foot"><a routerLink="/blog" class="link-arrow">Read the blog</a></p>
        </div>
      </section>
    }

    @defer (hydrate on viewport) {
      <section class="section" aria-labelledby="faq-title">
        <div class="container container--narrow">
          <div class="section-head section-head--center">
            <p class="eyebrow">FAQ</p>
            <h2 id="faq-title">Questions, answered</h2>
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
      title: 'Online Bodybuilding Coach & Personal Trainer',
      description:
        'Personal bodybuilding coaching online and in person: individual training programs, nutrition coaching and weekly check-ins to build muscle and lose fat.',
      path: '/',
    });
  }
}
