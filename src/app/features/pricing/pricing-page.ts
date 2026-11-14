import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PackageStore } from '../../core/data-access/package.store';
import { GENERAL_FAQS } from '../../core/data/faqs.data';
import { CoachingPackage } from '../../core/models';
import { applyPageSeo } from '../../core/seo/page-seo';
import { offerCatalogSchema } from '../../core/seo/schema.builders';
import { SeoService } from '../../core/seo/seo.service';
import { PackageCard } from '../../shared/cards/package-card';
import { CtaSection } from '../../shared/ui/cta-section';
import { FaqList } from '../../shared/ui/faq-list';
import { PageHero } from '../../shared/ui/page-hero';

type ComparisonKey = keyof Pick<
  CoachingPackage,
  'duration' | 'trainingPlan' | 'nutrition' | 'checkIns' | 'communication' | 'support'
>;

@Component({
  selector: 'app-pricing-page',
  imports: [RouterLink, CurrencyPipe, PageHero, PackageCard, FaqList, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      eyebrow="Coaching packages"
      title="Transparent pricing. Serious results."
      lead="Choose the level of support that fits your goals. Every package includes an individual plan, access to the client dashboard and a coach who is invested in your progress."
      [breadcrumbs]="[{ label: 'Pricing', url: '/pricing' }]"
    />

    <section class="section" aria-label="Packages">
      <div class="container packages">
        @for (pkg of packages.active(); track pkg.id) {
          <app-package-card [pkg]="pkg" [detailed]="true" />
        }
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="compare-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Compare</p>
          <h2 id="compare-title">Package comparison</h2>
        </div>
        <div class="table-wrap">
          <table class="table compare">
            <caption class="visually-hidden">
              Coaching package comparison
            </caption>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                @for (pkg of packages.active(); track pkg.id) {
                  <th scope="col" [class.is-highlight]="pkg.highlighted">{{ pkg.name }}</th>
                }
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Price</th>
                @for (pkg of packages.active(); track pkg.id) {
                  <td [class.is-highlight]="pkg.highlighted">
                    <strong>{{ pkg.price | currency: pkg.currency : 'symbol' : '1.0-0' }}</strong> /
                    {{ pkg.billingPeriod }}
                  </td>
                }
              </tr>
              @for (row of rows; track row.key) {
                <tr>
                  <th scope="row">{{ row.label }}</th>
                  @for (pkg of packages.active(); track pkg.id) {
                    <td [class.is-highlight]="pkg.highlighted">{{ pkg[row.key] }}</td>
                  }
                </tr>
              }
              <tr>
                <th scope="row"><span class="visually-hidden">Choose a package</span></th>
                @for (pkg of packages.active(); track pkg.id) {
                  <td [class.is-highlight]="pkg.highlighted">
                    <a
                      class="btn btn--sm"
                      [class.btn--primary]="pkg.highlighted"
                      routerLink="/contact"
                      [queryParams]="{ package: pkg.id }"
                      >{{ pkg.ctaLabel }}</a
                    >
                  </td>
                }
              </tr>
            </tbody>
          </table>
        </div>
        <p class="disclaimer note">
          Prices include VAT where applicable. Programs can also be purchased individually from the
          <a routerLink="/programs">program catalog</a>. Not sure which package fits?
          <a routerLink="/contact">Book a free consultation</a>.
        </p>
      </div>
    </section>

    <section class="section" aria-labelledby="pricing-faq">
      <div class="container container--narrow">
        <div class="section-head section-head--center">
          <h2 id="pricing-faq">Pricing questions</h2>
        </div>
        <app-faq-list [items]="faqs" />
      </div>
    </section>

    <app-cta-section />
  `,
  styles: `
    .packages {
      display: grid;
      gap: var(--sp-5);
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
    }
    .compare th[scope='row'] {
      background: none;
      white-space: nowrap;
    }
    .compare td,
    .compare th {
      min-width: 170px;
    }
    .compare .is-highlight {
      background: var(--c-accent-soft);
    }
    .note {
      margin-top: var(--sp-5);
    }
  `,
})
export class PricingPage {
  protected readonly packages = inject(PackageStore);
  protected readonly faqs = GENERAL_FAQS.filter((f) =>
    ['faq-cancel', 'faq-online', 'faq-nutrition', 'faq-results'].includes(f.id),
  );
  protected readonly rows: readonly { key: ComparisonKey; label: string }[] = [
    { key: 'duration', label: 'Duration' },
    { key: 'trainingPlan', label: 'Training plan' },
    { key: 'nutrition', label: 'Nutrition guidance' },
    { key: 'checkIns', label: 'Check-ins' },
    { key: 'communication', label: 'Coach communication' },
    { key: 'support', label: 'Support level' },
  ];

  constructor() {
    const seo = inject(SeoService);
    applyPageSeo('pricing', {
      title: 'Coaching Packages & Pricing',
      description:
        'Transparent pricing for starter coaching, online personal coaching, premium transformation coaching, advanced bodybuilding coaching and competition preparation.',
    });
    effect(() =>
      seo.setPageSchema(
        'offers',
        offerCatalogSchema((p) => seo.absoluteUrl(p), this.packages.active()),
      ),
    );
  }
}
