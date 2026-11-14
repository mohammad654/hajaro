import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { applyPageSeo } from '../../core/seo/page-seo';
import { CtaSection } from '../../shared/ui/cta-section';
import { PageHero } from '../../shared/ui/page-hero';
import { NutritionCalculator } from './nutrition-calculator';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-calculators-page',
  imports: [LocalePathPipe, RouterLink, PageHero, NutritionCalculator, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      eyebrow="Free tools"
      title="Nutrition calculators"
      lead="Estimate your BMI, daily calories, protein needs, macronutrients and water intake. Enter your details once — every calculator updates instantly."
      [breadcrumbs]="[
        { label: 'Nutrition', url: '/nutrition' },
        { label: 'Calculators', url: '/nutrition/calculators' },
      ]"
    />
    <section class="section section--tight">
      <div class="container">
        <nav class="jump cluster" aria-label="Jump to calculator">
          <a [routerLink]="[]" fragment="bmi" class="chip">BMI</a>
          <a [routerLink]="[]" fragment="calories" class="chip">Calories</a>
          <a [routerLink]="[]" fragment="protein" class="chip">Protein</a>
          <a [routerLink]="[]" fragment="macros" class="chip">Macros</a>
          <a [routerLink]="[]" fragment="water" class="chip">Water</a>
        </nav>
        <app-nutrition-calculator />
        <p class="more">
          <a [routerLink]="'/nutrition' | localePath" class="link-arrow"
            >Learn how to use these numbers in the nutrition guide</a
          >
        </p>
      </div>
    </section>
    <app-cta-section
      eyebrow="Beyond the estimate"
      title="Get targets built for you"
      text="Calculators give a starting point. Coaching turns your real-world data — weight trends, performance and recovery — into precise, weekly-adjusted targets."
    />
  `,
  styles: `
    .jump {
      margin-bottom: var(--sp-6);
    }
    .jump .chip {
      text-decoration: none;
    }
    .more {
      margin-top: var(--sp-6);
    }
  `,
})
export class CalculatorsPage {
  constructor() {
    applyPageSeo('calculators', {
      title: 'Calorie, Protein, Macro, BMI & Water Calculators',
      description:
        'Free fitness nutrition calculators: estimate daily calories, protein intake, macronutrients, BMI and daily water intake for muscle gain or fat loss.',
    });
  }
}
