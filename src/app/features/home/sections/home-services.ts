import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCatalogStore } from '../../../core/data-access/service-catalog.store';
import { Icon } from '../../../shared/ui/icon/icon';
import { LocalePathPipe } from '../../../core/i18n/current-locale';

@Component({
  selector: 'app-home-services',
  imports: [LocalePathPipe, RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--alt" aria-labelledby="services-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow" i18n>Coaching</p>
          <h2 id="services-title" i18n>Coaching around your goal</h2>
          <p i18n>
            From your first months in the gym to your first show: you get a plan written for you,
            and someone who checks in every week.
          </p>
        </div>
        <div class="grid grid--4">
          @for (service of services.featured(); track service.id) {
            <article class="card card--interactive service">
              <span class="service__icon"><app-icon [name]="service.icon" [size]="26" /></span>
              <h3 class="card__title">
                <a class="card__link" [routerLink]="['/services', service.slug] | localePath">{{
                  service.name
                }}</a>
              </h3>
              <p class="text-muted text-small">{{ service.shortDescription }}</p>
            </article>
          }
        </div>
        <div class="section-foot">
          <a [routerLink]="'/services' | localePath" class="btn" i18n>All services</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .service {
      display: flex;
      flex-direction: column;
      gap: var(--sp-2);
    }
    .service__icon {
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      margin-bottom: var(--sp-3);
      border-radius: var(--radius);
      background: var(--c-accent-soft);
      color: var(--c-accent);
    }
    p {
      margin: 0;
    }
    .section-foot {
      margin-top: var(--sp-7);
      text-align: center;
    }
  `,
})
export class HomeServices {
  protected readonly services = inject(ServiceCatalogStore);
}
