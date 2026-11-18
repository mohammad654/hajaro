import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PackageStore } from '../../core/data-access/package.store';
import { GENERAL_FAQS } from '../../core/data/faqs.data';
import { BILLING_PERIOD_LABELS, CoachingPackage } from '../../core/models';
import { applyPageSeo } from '../../core/seo/page-seo';
import { offerCatalogSchema } from '../../core/seo/schema.builders';
import { SeoService } from '../../core/seo/seo.service';
import { PackageCard } from '../../shared/cards/package-card';
import { CtaSection } from '../../shared/ui/cta-section';
import { FaqList } from '../../shared/ui/faq-list';
import { PageHero } from '../../shared/ui/page-hero';
import { LocalePathPipe } from '../../core/i18n/current-locale';

type ComparisonKey = keyof Pick<
  CoachingPackage,
  'duration' | 'trainingPlan' | 'nutrition' | 'checkIns' | 'communication' | 'support'
>;

@Component({
  selector: 'app-pricing-page',
  imports: [LocalePathPipe, RouterLink, CurrencyPipe, PageHero, PackageCard, FaqList, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      i18n-eyebrow
      eyebrow="Pricing"
      i18n-title
      title="Coaching packages and prices"
      i18n-lead
      lead="Prices are clear from the start. Pick a package, or ask me which one fits. Every package includes a plan written for you and access to the client dashboard."
      [breadcrumbs]="breadcrumbs"
    />

    <section class="section" i18n-aria-label aria-label="Packages">
      <div class="container packages reveal-group">
        @for (pkg of packages.active(); track pkg.id) {
          <app-package-card [pkg]="pkg" [detailed]="true" />
        }
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="compare-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow" i18n>Compare</p>
          <h2 id="compare-title" i18n>Compare packages</h2>
        </div>
        <div class="table-wrap">
          <table class="table compare">
            <caption class="visually-hidden" i18n>
              Coaching packages compared
            </caption>
            <thead>
              <tr>
                <th scope="col" i18n>What's included</th>
                @for (pkg of packages.active(); track pkg.id) {
                  <th scope="col" [class.is-highlight]="pkg.highlighted">{{ pkg.name }}</th>
                }
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" i18n>Price</th>
                @for (pkg of packages.active(); track pkg.id) {
                  <td [class.is-highlight]="pkg.highlighted">
                    <strong>{{ pkg.price | currency: pkg.currency : 'symbol' : '1.0-0' }}</strong>
                    {{ periodLabels[pkg.billingPeriod] }}
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
                <th scope="row"><span class="visually-hidden" i18n>Choose a package</span></th>
                @for (pkg of packages.active(); track pkg.id) {
                  <td [class.is-highlight]="pkg.highlighted">
                    <a
                      class="btn btn--sm"
                      [class.btn--primary]="pkg.highlighted"
                      [routerLink]="'/contact' | localePath"
                      [queryParams]="{ package: pkg.id }"
                      >{{ pkg.ctaLabel }}</a
                    >
                  </td>
                }
              </tr>
            </tbody>
          </table>
        </div>
        <p class="disclaimer note" i18n>
          Prices include VAT where applicable. You can also buy single training programs in the
          <a [routerLink]="'/programs' | localePath">program overview</a>. Not sure which package
          fits? <a [routerLink]="'/contact' | localePath">Book a free intro</a>.
        </p>
      </div>
    </section>

    <section class="section" aria-labelledby="pricing-faq">
      <div class="container container--narrow">
        <div class="section-head section-head--center">
          <h2 id="pricing-faq" i18n>Questions about prices</h2>
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
    .compare td,
    .compare th {
      min-width: 170px;
    }
    /* Keep the row labels in view while the packages scroll sideways. */
    .compare th[scope='row'],
    .compare thead th:first-child {
      position: sticky;
      left: 0;
      z-index: 1;
    }
    .compare th[scope='row'] {
      background: var(--c-surface);
      white-space: nowrap;
    }
    @media (max-width: 639.98px) {
      .compare th[scope='row'],
      .compare thead th:first-child {
        min-width: 116px;
        max-width: 116px;
        white-space: normal;
      }
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
  protected readonly periodLabels = BILLING_PERIOD_LABELS;
  protected readonly breadcrumbs = [{ label: $localize`Pricing`, url: '/pricing' }];
  protected readonly rows: readonly { key: ComparisonKey; label: string }[] = [
    { key: 'duration', label: $localize`Duration` },
    { key: 'trainingPlan', label: $localize`Training plan` },
    { key: 'nutrition', label: $localize`Nutrition guidance` },
    { key: 'checkIns', label: $localize`Check-ins` },
    { key: 'communication', label: $localize`Contact with me` },
    { key: 'support', label: $localize`Support level` },
  ];

  constructor() {
    const seo = inject(SeoService);
    applyPageSeo('pricing', {
      title: $localize`Pricing & Packages`,
      description: $localize`Clear prices for personal training and online coaching. See the packages, what is included and how to book.`,
    });
    effect(() =>
      seo.setPageSchema(
        'offers',
        offerCatalogSchema((p) => seo.absoluteUrl(p), this.packages.active()),
      ),
    );
  }
}
