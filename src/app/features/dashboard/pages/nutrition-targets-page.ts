import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NUTRITION_DISCLAIMER } from '../../../core/data/nutrition.data';
import { ClientPortal } from '../client-portal.service';

const KCAL_PER_G = { protein: 4, carbs: 4, fat: 9 } as const;

@Component({
  selector: 'app-nutrition-targets-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <p class="eyebrow">Nutrition</p>
      <h1>Your daily targets</h1>
      <p class="text-muted">Set by your coach and adjusted based on your weekly check-ins.</p>
    </header>

    @if (targets(); as t) {
      <div class="grid grid--4 stats">
        <div class="card stat">
          <span class="stat__label">Calories</span
          ><span class="stat__value">{{ t.calories }}<small> kcal</small></span>
        </div>
        <div class="card stat">
          <span class="stat__label">Protein</span
          ><span class="stat__value">{{ t.proteinG }}<small> g</small></span>
        </div>
        <div class="card stat">
          <span class="stat__label">Carbohydrates</span
          ><span class="stat__value">{{ t.carbsG }}<small> g</small></span>
        </div>
        <div class="card stat">
          <span class="stat__label">Fats</span
          ><span class="stat__value">{{ t.fatG }}<small> g</small></span>
        </div>
      </div>

      <div class="grid grid--2">
        <section class="card">
          <h2 class="h-sm">Calorie split</h2>
          @for (row of split(); track row.label) {
            <div class="bar-row">
              <div class="bar-row__label">
                <span>{{ row.label }}</span
                ><span>{{ row.pct }}%</span>
              </div>
              <div class="bar"><span [style.width.%]="row.pct"></span></div>
            </div>
          }
        </section>
        <section class="card">
          <h2 class="h-sm">Hydration & notes</h2>
          <p>
            <strong>{{ t.waterL }} L</strong> water per day
          </p>
          @if (t.notes) {
            <p class="feedback">{{ t.notes }}</p>
          }
          <a routerLink="/nutrition" class="link-arrow">Nutrition guide</a>
        </section>
      </div>
    } @else {
      <div class="card empty">
        <h2>Targets coming soon</h2>
        <p>
          Your coach will set your nutrition targets after reviewing your onboarding. Meanwhile, try
          the <a routerLink="/nutrition/calculators">calculators</a>.
        </p>
      </div>
    }
    <p class="disclaimer note">{{ disclaimer }}</p>
  `,
  styleUrl: './dashboard-pages.scss',
  styles: `
    .bar-row {
      margin-bottom: var(--sp-4);
    }
    .bar-row__label {
      display: flex;
      justify-content: space-between;
      font-size: var(--fs-sm);
      margin-bottom: var(--sp-2);
    }
    .bar {
      height: 8px;
      border-radius: var(--radius-pill);
      background: var(--c-surface-3);
      overflow: hidden;
    }
    .bar span {
      display: block;
      height: 100%;
      background: var(--c-accent);
    }
    .note {
      margin-top: var(--sp-6);
    }
  `,
})
export class NutritionTargetsPage {
  private readonly portal = inject(ClientPortal);
  protected readonly disclaimer = NUTRITION_DISCLAIMER;
  protected readonly targets = computed(() => this.portal.profile()?.nutrition);

  protected readonly split = computed(() => {
    const t = this.targets();
    if (!t) return [];
    const p = t.proteinG * KCAL_PER_G.protein;
    const c = t.carbsG * KCAL_PER_G.carbs;
    const f = t.fatG * KCAL_PER_G.fat;
    const total = p + c + f || 1;
    return [
      { label: 'Protein', pct: Math.round((p / total) * 100) },
      { label: 'Carbohydrates', pct: Math.round((c / total) * 100) },
      { label: 'Fats', pct: Math.round((f / total) * 100) },
    ];
  });
}
