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
      i18n-eyebrow
      eyebrow="Free tools"
      i18n-title
      title="Nutrition calculators"
      i18n-lead
      lead="Estimate your BMI, daily calories, protein, macros and water. Fill in your details once and every calculator updates straight away."
      [breadcrumbs]="breadcrumbs"
      imageSrc="images/home/kitchen-scale-weighing-bowl.webp"
      [imageBackground]="true"
      imagePosition="center 55%"
    />
    <section class="section section--tight">
      <div class="container">
        <nav class="jump cluster" i18n-aria-label aria-label="Jump to calculator">
          <a [routerLink]="[]" fragment="bmi" class="chip">BMI</a>
          <a [routerLink]="[]" fragment="calories" class="chip" i18n>Calories</a>
          <a [routerLink]="[]" fragment="protein" class="chip" i18n>Protein</a>
          <a [routerLink]="[]" fragment="macros" class="chip" i18n>Macros</a>
          <a [routerLink]="[]" fragment="water" class="chip" i18n>Water</a>
        </nav>
        <app-nutrition-calculator />
        <p class="more">
          <a [routerLink]="'/nutrition' | localePath" class="link-arrow" i18n
            >Learn how to use these numbers in the nutrition guide</a
          >
        </p>
      </div>
    </section>
    @defer (hydrate on viewport) {
      <app-cta-section
        i18n-eyebrow
        eyebrow="More than an estimate"
        i18n-title
        title="Targets set for you"
        i18n-text
        text="A calculator gives you a starting point. With coaching, I use your real data (weight trend, performance and recovery) to set your targets and adjust them every week."
      />
    }
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
  protected readonly breadcrumbs = [
    { label: $localize`Nutrition`, url: '/nutrition' },
    { label: $localize`Calculators`, url: '/nutrition/calculators' },
  ];

  constructor() {
    applyPageSeo('calculators', {
      title: $localize`Calorie, Protein, Macro, BMI & Water Calculators`,
      description: $localize`Free calculators: estimate your daily calories, protein, macros, BMI and water for building muscle or losing fat.`,
    });
  }
}
