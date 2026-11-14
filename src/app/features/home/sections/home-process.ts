import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COACHING_STEPS, NUTRITION_PILLARS } from '../home.content';
import { LocalePathPipe } from '../../../core/i18n/current-locale';

@Component({
  selector: 'app-home-process',
  imports: [LocalePathPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" aria-labelledby="process-title">
      <div class="container">
        <div class="section-head section-head--center">
          <p class="eyebrow" i18n>How coaching works</p>
          <h2 id="process-title" i18n>From intro to your first check-in</h2>
        </div>
        <ol class="steps">
          @for (step of steps; track step.title; let i = $index) {
            <li class="card step">
              <span class="step__num" aria-hidden="true">{{
                (i + 1).toString().padStart(2, '0')
              }}</span>
              <h3>{{ step.title }}</h3>
              <p class="text-muted text-small">{{ step.description }}</p>
            </li>
          }
        </ol>
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="nutrition-title">
      <div class="container split">
        <div>
          <p class="eyebrow" i18n>Food and recovery</p>
          <h2 id="nutrition-title" i18n>You can't out-train your kitchen</h2>
          <p class="lead" i18n>
            Training gives your body a reason to change. Food, sleep and recovery decide how much it
            actually changes. Coaching covers all of it, in a way that fits your week.
          </p>
          <ul class="check-list">
            @for (item of nutrition; track item) {
              <li>{{ item }}</li>
            }
          </ul>
          <div class="cluster nutrition__ctas">
            <a [routerLink]="'/nutrition' | localePath" class="btn" i18n>Nutrition guide</a>
            <a [routerLink]="'/nutrition/calculators' | localePath" class="btn btn--ghost" i18n
              >Free calculators</a
            >
          </div>
        </div>
        <div class="macro card" i18n-aria-label aria-label="Example macronutrient split">
          <p class="eyebrow" i18n>Example daily targets</p>
          @for (macro of macros; track macro.label) {
            <div class="macro__row">
              <div class="macro__label">
                <span>{{ macro.label }}</span><strong>{{ macro.value }}</strong>
              </div>
              <div class="macro__bar"><span [style.width.%]="macro.pct"></span></div>
            </div>
          }
          <p class="disclaimer" i18n>
            Example only. Your own targets depend on your goal, size and activity.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .steps {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: var(--sp-5);
    }
    @media (min-width: 640px) {
      .steps {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1080px) {
      .steps {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    .step__num {
      display: block;
      font-family: var(--font-display);
      font-size: var(--fs-3xl);
      font-weight: 800;
      line-height: 1;
      color: transparent;
      -webkit-text-stroke: 1.5px var(--c-accent);
      margin-bottom: var(--sp-4);
    }
    .step h3 {
      font-size: var(--fs-lg);
    }
    .step p {
      margin: 0;
    }
    .check-list {
      margin: var(--sp-5) 0 var(--sp-6);
    }
    .macro {
      display: grid;
      gap: var(--sp-4);
    }
    .macro__label {
      display: flex;
      justify-content: space-between;
      font-size: var(--fs-sm);
      margin-bottom: var(--sp-2);
    }
    .macro__bar {
      height: 8px;
      border-radius: var(--radius-pill);
      background: var(--c-surface-3);
      overflow: hidden;
    }
    .macro__bar span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--c-accent), var(--c-accent-strong));
    }
  `,
})
export class HomeProcess {
  protected readonly steps = COACHING_STEPS;
  protected readonly nutrition = NUTRITION_PILLARS;
  protected readonly macros = [
    { label: $localize`Protein`, value: '170 g', pct: 30 },
    { label: $localize`Carbohydrates`, value: '300 g', pct: 50 },
    { label: $localize`Fat`, value: '75 g', pct: 20 },
  ];
}
