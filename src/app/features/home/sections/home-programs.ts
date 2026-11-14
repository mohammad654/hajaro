import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgramStore } from '../../../core/data-access/program.store';
import { ProgramCard } from '../../../shared/cards/program-card';
import { AnatomyFigure } from '../../../shared/anatomy/anatomy-figure';
import { LocalePathPipe } from '../../../core/i18n/current-locale';

@Component({
  selector: 'app-home-programs',
  imports: [LocalePathPipe, RouterLink, ProgramCard, AnatomyFigure],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" aria-labelledby="programs-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow" i18n>Training programs</p>
          <h2 id="programs-title" i18n>Training programs for every level</h2>
          <p i18n>
            Training splits with clear rules for progress, warm-ups and rest times. From your first
            gym session to advanced bodybuilding.
          </p>
        </div>
        <div class="grid grid--4">
          @for (program of programs.featured(); track program.id; let first = $first) {
            <app-program-card [program]="program" [highlight]="first" />
          }
        </div>
        <div class="section-foot">
          <a [routerLink]="'/programs' | localePath" class="btn" i18n>All programs</a>
        </div>

        <aside class="tools card" aria-labelledby="tools-title">
          <div class="tools__figure" aria-hidden="true">
            <app-anatomy-figure
              view="back"
              [primary]="['lats', 'rear-delts']"
              [secondary]="['rhomboids', 'biceps']"
            />
          </div>
          <div>
            <p class="eyebrow" i18n>Free training tools</p>
            <h3 id="tools-title" i18n>Look up any muscle, then plan your sessions</h3>
            <p class="text-muted" i18n>
              Tap a muscle on the anatomy chart to see what it does and which exercises train it.
              Then build and log your own routines in the workout planner.
            </p>
            <div class="cluster">
              <a [routerLink]="'/muscle-chart' | localePath" class="btn btn--primary" i18n
                >Open the muscle chart</a
              >
              <a [routerLink]="'/workout-planner' | localePath" class="btn" i18n>Workout planner</a>
              <a [routerLink]="'/exercises' | localePath" class="btn btn--ghost" i18n
                >Exercise library</a
              >
            </div>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .section-foot {
      margin-top: var(--sp-7);
      text-align: center;
    }
    .tools {
      display: grid;
      gap: var(--sp-6);
      align-items: center;
      margin-top: var(--sp-8);
      background:
        radial-gradient(60% 100% at 0% 50%, rgb(232 176 74 / 12%), transparent 70%),
        var(--c-surface);
    }
    @media (min-width: 820px) {
      .tools {
        grid-template-columns: 180px 1fr;
      }
    }
    .tools__figure {
      max-width: 180px;
      margin-inline: auto;
    }
  `,
})
export class HomePrograms {
  protected readonly programs = inject(ProgramStore);
}
