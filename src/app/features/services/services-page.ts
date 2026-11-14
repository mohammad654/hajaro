import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCatalogStore } from '../../core/data-access/service-catalog.store';
import { CoachingService, ServiceDelivery } from '../../core/models';
import { applyPageSeo } from '../../core/seo/page-seo';
import { CtaSection } from '../../shared/ui/cta-section';
import { Icon } from '../../shared/ui/icon/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { LocalePathPipe } from '../../core/i18n/current-locale';

export const DELIVERY_LABELS: Readonly<Record<ServiceDelivery, string>> = {
  online: 'Online',
  'in-person': 'In person',
  hybrid: 'Online or in person',
};

@Component({
  selector: 'app-services-page',
  imports: [LocalePathPipe, RouterLink, PageHero, Icon, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      eyebrow="Coaching services"
      title="Personal training & bodybuilding coaching"
      lead="From your first structured program to contest preparation — choose the support that fits your goal. Every service is personalised and backed by weekly accountability."
      [breadcrumbs]="[{ label: 'Coaching services', url: '/services' }]"
    />

    <section class="section" aria-label="All services">
      <div class="container grid grid--3">
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
            <span class="link-arrow">Learn more</span>
          </article>
        }
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="compare-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Not sure where to start?</p>
          <h2 id="compare-title">Find the right fit</h2>
        </div>
        <div class="table-wrap">
          <table class="table">
            <caption class="visually-hidden">
              Which coaching service fits your goal
            </caption>
            <thead>
              <tr>
                <th scope="col">Your situation</th>
                <th scope="col">Recommended</th>
                <th scope="col">Format</th>
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
  protected readonly deliveryLabels = DELIVERY_LABELS;

  private static readonly GUIDE: readonly { situation: string; slug: string }[] = [
    { situation: 'I am new to lifting and want to learn properly', slug: 'beginner-bodybuilding' },
    {
      situation: 'I want to build muscle as efficiently as possible',
      slug: 'muscle-building-programs',
    },
    { situation: 'I want to lose fat without losing muscle', slug: 'fat-loss-coaching' },
    {
      situation: 'I want to build muscle and lose fat at the same time',
      slug: 'body-recomposition',
    },
    {
      situation: 'I have trained for years and progress has stalled',
      slug: 'advanced-bodybuilding',
    },
    { situation: 'I want to compete on stage', slug: 'competition-preparation' },
    { situation: 'I want a coach but train far away', slug: 'online-personal-training' },
  ];

  protected readonly guide = computed(() =>
    ServicesPage.GUIDE.map((row) => ({
      situation: row.situation,
      service: this.services.bySlug(row.slug),
    })).filter((row): row is { situation: string; service: CoachingService } => !!row.service),
  );

  constructor() {
    applyPageSeo('services', {
      title: 'Personal Training & Bodybuilding Coaching Services',
      description:
        'Online personal training, in-person coaching, muscle building, fat loss, body recomposition, strength, competition preparation and posing coaching.',
    });
  }
}
