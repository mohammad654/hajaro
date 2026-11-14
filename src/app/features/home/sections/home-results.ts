import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TestimonialStore, TransformationStore } from '../../../core/data-access/results.stores';
import { MediaFrame } from '../../../shared/ui/media-frame';
import { LocalePathPipe } from '../../../core/i18n/current-locale';

/**
 * Client results. Shows only real, consented transformations and testimonials.
 * When none have been published yet, an honest statement is shown instead of placeholder "results".
 */
@Component({
  selector: 'app-home-results',
  imports: [LocalePathPipe, RouterLink, MediaFrame],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--alt" aria-labelledby="results-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow" i18n>Client results</p>
          <h2 id="results-title" i18n>Progress from real clients</h2>
          <p i18n>
            Every story here is from a real client and is shared only with their written permission.
          </p>
        </div>

        @if (transformations.public().length) {
          <div class="grid grid--3">
            @for (story of transformations.public().slice(0, 3); track story.id) {
              <article class="card">
                <div class="pair">
                  <app-media-frame
                    [src]="story.beforeImageUrl"
                    i18n-alt
                    alt="{{ story.clientName }} before"
                    ratio="3 / 4"
                    i18n-caption
                    caption="Before"
                  />
                  <app-media-frame
                    [src]="story.afterImageUrl"
                    i18n-alt
                    alt="{{ story.clientName }} after"
                    ratio="3 / 4"
                    i18n-caption
                    caption="After"
                  />
                </div>
                <h3 class="card__title">{{ story.headline }}</h3>
                <p class="text-small text-muted" i18n>
                  {{ story.clientName }}, {{ story.durationWeeks }} weeks
                </p>
              </article>
            }
          </div>
        }

        @if (testimonials.public().length) {
          <div class="grid grid--3 quotes">
            @for (t of testimonials.public().slice(0, 3); track t.id) {
              <figure class="card card--flat quote">
                <blockquote>“{{ t.quote }}”</blockquote>
                <figcaption>
                  <strong>{{ t.clientName }}</strong>
                  <span>{{ t.context }}</span>
                </figcaption>
              </figure>
            }
          </div>
        }

        @if (!transformations.public().length && !testimonials.public().length) {
          <div class="card empty">
            <h3 i18n>No client stories here yet</h3>
            <p class="text-muted" i18n>
              I only publish real results, with each client's written permission. New stories appear
              when clients finish a program and choose to share them.
            </p>
          </div>
        }

        <div class="section-foot">
          <a [routerLink]="'/transformations' | localePath" class="link-arrow" i18n
            >How I share client results</a
          >
        </div>
      </div>
    </section>
  `,
  styles: `
    .pair {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--sp-2);
      margin-bottom: var(--sp-4);
    }
    .quotes {
      margin-top: var(--sp-6);
    }
    .quote {
      margin: 0;
    }
    blockquote {
      margin: 0 0 var(--sp-4);
      font-size: var(--fs-md);
    }
    figcaption {
      display: grid;
      font-size: var(--fs-sm);
    }
    figcaption span {
      color: var(--c-text-subtle);
    }
    .empty {
      max-width: 760px;
      text-align: center;
      margin-inline: auto;
    }
    .section-foot {
      margin-top: var(--sp-6);
      text-align: center;
    }
  `,
})
export class HomeResults {
  protected readonly transformations = inject(TransformationStore);
  protected readonly testimonials = inject(TestimonialStore);
}
