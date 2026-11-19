import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleStore } from '../../core/data-access/article.store';
import { NUTRITION_DISCLAIMER, NUTRITION_TOPICS } from '../../core/data/nutrition.data';
import { applyPageSeo } from '../../core/seo/page-seo';
import { ArticleCard } from '../../shared/cards/article-card';
import { CtaSection } from '../../shared/ui/cta-section';
import { Icon } from '../../shared/ui/icon/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-nutrition-page',
  imports: [LocalePathPipe, RouterLink, PageHero, Icon, ArticleCard, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      i18n-eyebrow
      eyebrow="Nutrition"
      i18n-title
      title="Food for muscle and performance"
      i18n-lead
      lead="Clear information about eating to build muscle, lose fat and recover well. No extremes, no gimmicks."
      [breadcrumbs]="breadcrumbs"
      imageSrc="images/home/meal-prep-chicken-rice-broccoli.webp"
      i18n-imageAlt
      imageAlt="Meal prep box with rice, shredded chicken, broccoli and courgette"
      imagePosition="center 60%"
    >
      <div class="cluster hero-ctas">
        <a class="btn btn--primary" [routerLink]="'/nutrition/calculators' | localePath" i18n
          >Open the calculators</a
        >
        <a class="btn" [routerLink]="'/services/fat-loss-coaching' | localePath" i18n
          >Nutrition coaching</a
        >
      </div>
    </app-page-hero>

    <section class="section">
      <div class="container">
        <nav class="toc cluster" i18n-aria-label aria-label="Nutrition topics">
          @for (topic of topics; track topic.id) {
            <a class="chip" [routerLink]="[]" [fragment]="topic.id">{{ topic.title }}</a>
          }
        </nav>
        <div class="grid grid--2 topics reveal-group">
          @for (topic of topics; track topic.id) {
            <section
              class="card topic"
              [id]="topic.id"
              [attr.aria-labelledby]="topic.id + '-title'"
            >
              <span class="icon-tile topic__icon"
                ><app-icon [name]="topic.icon" [size]="24"
              /></span>
              <h2 [id]="topic.id + '-title'">{{ topic.title }}</h2>
              <p class="text-muted">{{ topic.summary }}</p>
              <ul class="check-list text-small">
                @for (point of topic.points; track point) {
                  <li>{{ point }}</li>
                }
              </ul>
            </section>
          }
        </div>
        <p class="alert alert--info disclaimer-box" role="note">{{ disclaimer }}</p>
      </div>
    </section>

    @if (articles().length) {
      <section class="section section--alt" aria-labelledby="nutrition-articles">
        <div class="container">
          <div class="section-head">
            <h2 id="nutrition-articles" i18n>Articles about food</h2>
          </div>
          <div class="grid grid--3 reveal-group">
            @for (article of articles(); track article.id) {
              <app-article-card [article]="article" />
            }
          </div>
        </div>
      </section>
    }

    @defer (hydrate on viewport) {
      <app-cta-section
        i18n-eyebrow
        eyebrow="Nutrition coaching"
        i18n-title
        title="Food that fits your life"
        i18n-text
        text="Calorie and macro targets set for you, a practical meal structure, and weekly adjustments based on your progress."
      />
    }
  `,
  styles: `
    .hero-ctas {
      margin-top: var(--sp-6);
    }
    .toc {
      margin-bottom: var(--sp-6);
    }
    .toc .chip {
      text-decoration: none;
    }
    .topic {
      scroll-margin-top: calc(var(--header-h) + var(--sp-4));
    }
    .topic h2 {
      font-size: var(--fs-xl);
    }
    .topic__icon {
      margin-bottom: var(--sp-4);
    }
    .disclaimer-box {
      margin-top: var(--sp-6);
    }
  `,
})
export class NutritionPage {
  protected readonly topics = NUTRITION_TOPICS;
  protected readonly disclaimer = NUTRITION_DISCLAIMER;
  protected readonly breadcrumbs = [{ label: $localize`Nutrition`, url: '/nutrition' }];
  private readonly articleStore = inject(ArticleStore);
  protected readonly articles = computed(() =>
    this.articleStore
      .published()
      .filter((a) => ['nutrition', 'fat-loss', 'supplements', 'recovery'].includes(a.category))
      .slice(0, 3),
  );

  constructor() {
    applyPageSeo('nutrition', {
      title: $localize`Nutrition Guide: Muscle Gain, Fat Loss & Macros`,
      description: $localize`Eating to build muscle or lose fat: protein, carbohydrates and fat, planning meals, drinking enough, supplements and recovery.`,
    });
  }
}
