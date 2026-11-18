import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteContentStore } from '../../../core/data-access/site-content.store';
import { MediaFrame } from '../../../shared/ui/media-frame';
import { LocalePathPipe } from '../../../core/i18n/current-locale';

/** Temporary stock photo, shown only until a real trainer photo is set in the site content. */
const DEMO_TRAINER_PHOTO = {
  src: 'images/home/luissantos2020-fitness-5991125_1920.jpg',
  alt: $localize`Muscular man leaning forward and gripping a bar, in black and white`,
  position: '55% center',
};

@Component({
  selector: 'app-home-coach',
  imports: [LocalePathPipe, RouterLink, MediaFrame],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" aria-labelledby="coach-title">
      <div class="container split">
        <app-media-frame
          [src]="photo().src"
          [alt]="photo().alt"
          [position]="photo().position"
          ratio="4 / 5"
          [caption]="content().trainerName"
        />
        <div>
          <p class="eyebrow" i18n>Your coach</p>
          <h2 id="coach-title">{{ content().trainerName }}</h2>
          <p class="lead">{{ content().trainerShortBio }}</p>

          @if (credentials().length) {
            <ul class="credentials">
              @for (item of credentials(); track item.title) {
                <li>
                  <strong>{{ item.title }}</strong>
                  <span
                    >{{ item.detail }}
                    @if (item.year) {
                      · {{ item.year }}
                    }
                  </span>
                </li>
              }
            </ul>
          } @else {
            <ol class="method">
              @for (pillar of content().methodology; track pillar.title) {
                <li>
                  <strong>{{ pillar.title }}</strong>
                  <span>{{ pillar.description }}</span>
                </li>
              }
            </ol>
          }
          <a [routerLink]="'/about' | localePath" class="link-arrow" i18n>More about me</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .credentials,
    .method {
      list-style: none;
      padding: 0;
      margin: var(--sp-6) 0;
      display: grid;
      gap: var(--sp-4);
    }
    li {
      display: grid;
      gap: var(--sp-1);
      padding-left: var(--sp-4);
      border-left: 2px solid var(--c-accent);
    }
    li span {
      color: var(--c-text-muted);
      font-size: var(--fs-sm);
    }
  `,
})
export class HomeCoach {
  protected readonly content = inject(SiteContentStore).content;
  protected readonly photo = computed(() => {
    const { trainerPhotoUrl: src, trainerPhotoAlt: alt } = this.content();
    return src ? { src, alt: alt ?? '', position: 'center' } : DEMO_TRAINER_PHOTO;
  });
  /** Only verified credentials are ever displayed. */
  protected readonly credentials = computed(() =>
    [...this.content().qualifications, ...this.content().achievements]
      .filter((c) => c.verified)
      .slice(0, 4),
  );
}
