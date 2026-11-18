import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCatalogStore } from '../../core/data-access/service-catalog.store';
import { GENERAL_FAQS } from '../../core/data/faqs.data';
import { CoachingService, SERVICE_DELIVERY_LABELS } from '../../core/models';
import { applyPageSeo } from '../../core/seo/page-seo';
import { CtaSection } from '../../shared/ui/cta-section';
import { FaqList } from '../../shared/ui/faq-list';
import { Icon } from '../../shared/ui/icon/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-services-page',
  imports: [LocalePathPipe, RouterLink, PageHero, Icon, FaqList, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      i18n-eyebrow
      eyebrow="Services"
      i18n-title
      title="Personal training and coaching"
      i18n-lead
      lead="In-person training, online coaching, contest prep and food guidance. Pick what fits your goal, or ask me and we'll work it out together."
      [breadcrumbs]="breadcrumbs"
      [imagePlaceholder]="true"
    />

    <section class="section" i18n-aria-label aria-label="All services">
      <div class="container grid grid--3 reveal-group">
        @for (service of services.all(); track service.id) {
          <article class="card card--interactive service">
            <div class="service__top">
              <span class="service__icon"><app-icon [name]="service.icon" [size]="26" /></span>
              <span class="badge">{{ deliveryLabels[service.delivery] }}</span>
            </div>
            <h2 class="card__title">
              <a class="card__link" [routerLink]="['/services', service.slug] | localePath">{{
                service.name
              }}</a>
            </h2>
            <p class="text-muted">{{ service.shortDescription }}</p>
            <span class="link-arrow" aria-hidden="true" i18n>Read more</span>
          </article>
        }
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="compare-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow" i18n>Not sure where to start?</p>
          <h2 id="compare-title" i18n>Find what fits you</h2>
        </div>
        <div class="table-wrap">
          <table class="table">
            <caption class="visually-hidden" i18n>
              Which coaching service fits your goal
            </caption>
            <thead>
              <tr>
                <th scope="col" i18n>Your situation</th>
                <th scope="col" i18n>Good fit</th>
                <th scope="col" i18n>Format</th>
              </tr>
            </thead>
            <tbody>
              @for (row of guide(); track row.situation) {
                <tr>
                  <td>{{ row.situation }}</td>
                  <td>
                    <a [routerLink]="['/services', row.service.slug] | localePath">{{
                      row.service.name
                    }}</a>
                  </td>
                  <td>{{ deliveryLabels[row.service.delivery] }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="faq-title">
      <div class="container container--narrow">
        <div class="section-head section-head--center">
          <p class="eyebrow" i18n>FAQ</p>
          <h2 id="faq-title" i18n>Frequently asked questions</h2>
        </div>
        <app-faq-list [items]="faqs" />
      </div>
    </section>

    <app-cta-section />
  `,
  styles: `
    .service {
      display: flex;
      flex-direction: column;
      gap: var(--sp-3);
    }
    .service__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .service__icon {
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      border-radius: var(--radius);
      background: var(--c-accent-soft);
      color: var(--c-accent);
    }
    @media (prefers-reduced-motion: no-preference) {
      .service__icon {
        transition: transform var(--dur) var(--ease);
      }
      .service:hover .service__icon,
      .service:focus-within .service__icon {
        transform: scale(1.08);
      }
    }
    .card__title {
      font-size: var(--fs-xl);
      margin: 0;
    }
    p {
      flex: 1;
      margin: 0;
    }
    .link-arrow {
      color: var(--c-accent);
    }
  `,
})
export class ServicesPage {
  protected readonly services = inject(ServiceCatalogStore);
  protected readonly deliveryLabels = SERVICE_DELIVERY_LABELS;
  protected readonly faqs = GENERAL_FAQS;
  protected readonly breadcrumbs = [{ label: $localize`Services`, url: '/services' }];

  private static readonly GUIDE: readonly { situation: string; slug: string }[] = [
    {
      situation: $localize`I'm new to lifting and want to learn it properly`,
      slug: 'beginner-bodybuilding',
    },
    { situation: $localize`I want to build muscle`, slug: 'muscle-building-programs' },
    { situation: $localize`I want to lose fat and keep my muscle`, slug: 'fat-loss-coaching' },
    {
      situation: $localize`I want to build muscle and lose fat at the same time`,
      slug: 'body-recomposition',
    },
    {
      situation: $localize`I've trained for years and stopped progressing`,
      slug: 'advanced-bodybuilding',
    },
    { situation: $localize`I want to compete on stage`, slug: 'competition-preparation' },
    {
      situation: $localize`I want a coach, but I live too far away to train together`,
      slug: 'online-personal-training',
    },
  ];

  protected readonly guide = computed(() =>
    ServicesPage.GUIDE.map((row) => ({
      situation: row.situation,
      service: this.services.bySlug(row.slug),
    })).filter((row): row is { situation: string; service: CoachingService } => !!row.service),
  );

  constructor() {
    applyPageSeo('services', {
      title: $localize`Personal Training & Coaching Services`,
      description: $localize`In-person training, online coaching, contest prep and nutrition guidance. See what fits your goal and how to get started.`,
    });
  }
}
