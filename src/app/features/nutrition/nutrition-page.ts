import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleStore } from '../../core/data-access/article.store';
import { NUTRITION_DISCLAIMER, NUTRITION_TOPICS } from '../../core/data/nutrition.data';
import { applyPageSeo } from '../../core/seo/page-seo';
import { ArticleCard } from '../../shared/cards/article-card';
import { CtaSection } from '../../shared/ui/cta-section';
import { Icon } from '../../shared/ui/icon/icon';
import { PageHero } from '../../shared/ui/page-hero';

@Component({
  selector: 'app-nutrition-page',
  imports: [RouterLink, PageHero, Icon, ArticleCard, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      eyebrow="Nutrition & diet"
      title="Nutrition for muscle and performance"
      lead="Clear, evidence-based nutrition education for building muscle, losing fat and recovering well — without extremes or gimmicks."
      [breadcrumbs]="[{ label: 'Nutrition', url: '/nutrition' }]"
    >
      <div class="cluster hero-ctas">
        <a class="btn btn--primary" routerLink="/nutrition/calculators">Open the calculators</a>
        <a class="btn" routerLink="/services/fat-loss-coaching">Nutrition coaching</a>
      </div>
    </app-page-hero>

    <section class="section">
      <div class="container">
        <nav class="toc cluster" aria-label="Nutrition topics">
          @for (topic of topics; track topic.id) {
            <a class="chip" [routerLink]="[]" [fragment]="topic.id">{{ topic.title }}</a>
          }
        </nav>
        <div class="grid grid--2 topics">
          @for (topic of topics; track topic.id) {
            <section
              class="card topic"
              [id]="topic.id"
              [attr.aria-labelledby]="topic.id + '-title'"
            >
              <span class="topic__icon"><app-icon [name]="topic.icon" [size]="24" /></span>
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
          <h2 id="nutrition-articles">Nutrition articles</h2>
          <div class="grid grid--3">
            @for (article of articles(); track article.id) {
              <app-article-card [article]="article" />
            }
          </div>
        </div>
      </section>
    }

    <app-cta-section
      eyebrow="Personal nutrition coaching"
      title="Nutrition that fits your life"
      text="Individual calorie and macro targets, practical meal structures and weekly adjustments based on your progress."
    />
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
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      margin-bottom: var(--sp-4);
      border-radius: var(--radius);
      background: var(--c-accent-soft);
      color: var(--c-accent);
    }
    .disclaimer-box {
      margin-top: var(--sp-6);
    }
  `,
})
export class NutritionPage {
  protected readonly topics = NUTRITION_TOPICS;
  protected readonly disclaimer = NUTRITION_DISCLAIMER;
  private readonly articleStore = inject(ArticleStore);
  protected readonly articles = computed(() =>
    this.articleStore
      .published()
      .filter((a) => ['nutrition', 'fat-loss', 'supplements', 'recovery'].includes(a.category))
      .slice(0, 3),
  );

  constructor() {
    applyPageSeo('nutrition', {
      title: 'Bodybuilding Nutrition Guide: Muscle Gain, Fat Loss & Macros',
      description:
        'Evidence-based bodybuilding nutrition: muscle-building and fat-loss nutrition, protein, carbohydrates and fats, meal planning, hydration, supplements and recovery.',
    });
  }
}
