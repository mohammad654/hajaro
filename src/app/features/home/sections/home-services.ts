import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCatalogStore } from '../../../core/data-access/service-catalog.store';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: 'app-home-services',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--alt" aria-labelledby="services-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Coaching services</p>
          <h2 id="services-title">Coaching built around your goal</h2>
          <p>
            Whether you are building your first foundation of muscle or preparing for the stage,
            every service combines expert programming with genuine accountability.
          </p>
        </div>
        <div class="grid grid--4">
          @for (service of services.featured(); track service.id) {
            <article class="card card--interactive service">
              <span class="service__icon"><app-icon [name]="service.icon" [size]="26" /></span>
              <h3 class="card__title">
                <a class="card__link" [routerLink]="['/services', service.slug]">{{
                  service.name
                }}</a>
              </h3>
              <p class="text-muted text-small">{{ service.shortDescription }}</p>
            </article>
          }
        </div>
        <div class="section-foot">
          <a routerLink="/services" class="btn">All coaching services</a>
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
