import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCatalogStore } from '../../../core/data-access/service-catalog.store';
import { Icon } from '../../../shared/ui/icon/icon';
import { MediaFrame } from '../../../shared/ui/media-frame';
import { LocalePathPipe } from '../../../core/i18n/current-locale';

interface ServiceImage {
  readonly src: string;
  readonly alt: string;
  readonly position: string;
}

/** Card photos by service slug. A featured service without an entry shows the placeholder. */
const SERVICE_IMAGES: Readonly<Record<string, ServiceImage | undefined>> = {
  'personal-bodybuilding-coaching': {
    src: 'images/home/useche360-ai-generated-8757611_1920.jpg',
    alt: $localize`Muscular man in a tank top standing in a gym`,
    position: 'center 5%',
  },
  'muscle-building-programs': {
    src: 'images/home/andrey_braynsk-man-5886567_1920.jpg',
    alt: $localize`Muscular man and woman posing together in a gym`,
    position: 'center 10%',
  },
  'fat-loss-coaching': {
    src: 'images/home/jandersnunes-slimming-8748460_1920.png',
    alt: $localize`Smiling woman in sportswear with a lean, defined midsection`,
    position: 'center 16%',
  },
  'online-personal-training': {
    src: 'images/home/images%20(2).jpeg',
    alt: $localize`Woman doing sit-ups on her own on a gym floor`,
    position: 'center',
  },
};

@Component({
  selector: 'app-home-services',
  imports: [LocalePathPipe, RouterLink, Icon, MediaFrame],
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
        <div class="grid grid--4 reveal-group">
          @for (service of services.featured(); track service.id) {
            <article class="card card--interactive service">
              @let image = images[service.slug];
              <app-media-frame
                class="service__media"
                [class.service__media--photo]="!!image"
                [src]="image?.src"
                [alt]="image?.alt ?? ''"
                [position]="image?.position ?? 'center'"
                ratio="4 / 3"
                sizes="(min-width: 1080px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
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
    .service__media {
      display: block;
      margin-bottom: var(--sp-3);
    }
    /* The source photos differ in colour; one treatment keeps the cards consistent. */
    .service__media--photo {
      filter: grayscale(1) contrast(1.05);
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
  protected readonly images = SERVICE_IMAGES;
}
