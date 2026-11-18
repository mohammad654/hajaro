import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalePathPipe } from '../../../core/i18n/current-locale';
import { MuscleId } from '../../../core/models';
import { AnatomyFigure } from '../../../shared/anatomy/anatomy-figure';
import { MediaFrame } from '../../../shared/ui/media-frame';

const MUSCLE_PHOTOS = [
  {
    src: 'images/home/iamfosna-man-7847247_1920.jpg',
    alt: $localize`Tattooed man gripping a barbell in a rack, seen from behind`,
  },
  {
    src: 'images/home/gomateyfitness-woman-9400023_1920.png',
    alt: $localize`Woman doing a seated dumbbell shoulder press in a gym`,
  },
  {
    src: 'images/home/bdmh-man-9330135_1920.jpg',
    alt: $localize`Bodybuilder seen from behind with arms spread, showing back and shoulders`,
  },
] as const;

@Component({
  selector: 'app-home-muscles',
  imports: [LocalePathPipe, RouterLink, AnatomyFigure, MediaFrame],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--alt" aria-labelledby="muscles-title">
      <div class="container split">
        <div class="muscles__figures" aria-hidden="true">
          <app-anatomy-figure view="front" [primary]="frontFocus" [animated]="true" />
          <app-anatomy-figure
            class="muscles__figure--back"
            view="back"
            [primary]="backFocus"
            [animated]="true"
          />
        </div>
        <div>
          <p class="eyebrow" i18n>Muscle Chart</p>
          <h2 id="muscles-title" i18n>Explore every muscle and how to train it</h2>
          <div class="muscles__photos">
            @for (photo of photos; track photo.src) {
              <app-media-frame
                [src]="photo.src"
                [alt]="photo.alt"
                ratio="1 / 1"
                sizes="(min-width: 1080px) 16vw, 33vw"
              />
            }
          </div>
          <a [routerLink]="'/muscle-chart' | localePath" class="link-arrow" i18n
            >Interactive muscle chart</a
          >
        </div>
      </div>
    </section>
  `,
  styles: `
    .muscles__figures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--sp-2);
      max-width: 520px;
      width: 100%;
      margin-inline: auto;
      padding-bottom: var(--sp-6);
    }
    .muscles__figure--back {
      transform: translateY(6%);
      opacity: 0.85;
    }
    /* Same treatment as the service card photos, so differently coloured sources match. */
    .muscles__photos {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--sp-3);
      margin-block: var(--sp-5);
      filter: grayscale(1) contrast(1.05);
    }
  `,
})
export class HomeMuscles {
  protected readonly photos = MUSCLE_PHOTOS;
  protected readonly frontFocus: readonly MuscleId[] = [
    'chest',
    'side-delts',
    'front-delts',
    'rectus-abdominis',
    'quadriceps',
  ];
  protected readonly backFocus: readonly MuscleId[] = [
    'lats',
    'traps',
    'glutes',
    'hamstrings',
    'rear-delts',
  ];
}
