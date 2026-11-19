import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ARTICLE_CATEGORY_LABELS, Article } from '../../core/models';
import { LabelPipe } from '../pipes/format.pipes';
import { MediaFrame } from '../ui/media-frame';
import { LocalePathPipe } from '../../core/i18n/current-locale';

interface ArticleImage {
  readonly src: string;
  readonly alt: string;
  readonly position: string;
}

/** Display photos by article slug. Kept out of the seed data so structured data stays unchanged. */
const ARTICLE_IMAGES: Readonly<Record<string, ArticleImage>> = {
  'progressive-overload-guide': {
    src: 'images/home/u_pcjeppoe5t-bodybuilder-8017875_1920.jpg',
    alt: $localize`Bronze statue of a muscular bodybuilder`,
    position: '50% 5%',
  },
  'squat-technique-guide': {
    src: 'images/home/layers-sketch-4801606_1920.jpg',
    alt: $localize`Sketch of a lifter in the bottom of a barbell back squat`,
    position: 'center',
  },
  'sustainable-fat-loss': {
    src: 'images/home/front-view-young-female-sport-outfit-measuring-her-sizes-waist_140725-85472.avif',
    alt: $localize`Woman in sportswear measuring her waist with a tape measure`,
    position: '50% 0%',
  },
  'building-training-consistency': {
    src: 'images/home/hansuan_fabregas-ai-generated-8706772_1920.jpg',
    alt: $localize`Determined athlete between battle ropes in a gym`,
    position: '50% 20%',
  },
  'sleep-and-recovery-for-lifters': {
    src: 'images/home/man-sleeping-dark-bedroom.webp',
    alt: $localize`Man asleep under a dark blanket in a dim bedroom`,
    position: 'center 40%',
  },
  'creatine-evidence-guide': {
    src: 'images/home/supplement-powder-scoop.webp',
    alt: $localize`White supplement powder spilling from a scoop`,
    position: 'center',
  },
  'protein-intake-for-muscle-growth': {
    src: 'images/home/chicken-salad-soft-boiled-eggs.webp',
    alt: $localize`Bowl of grilled chicken, lettuce and soft-boiled eggs`,
    position: 'center 45%',
  },
};

/** The article's own image when it has one, otherwise its display photo, if any. */
export function articleImage(article: Article): ArticleImage | null {
  if (article.featuredImageUrl) {
    return {
      src: article.featuredImageUrl,
      alt: article.featuredImageAlt ?? '',
      position: 'center',
    };
  }
  return ARTICLE_IMAGES[article.slug] ?? null;
}

@Component({
  selector: 'app-article-card',
  imports: [LocalePathPipe, RouterLink, DatePipe, LabelPipe, MediaFrame],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card card--interactive article-card">
      <app-media-frame
        [src]="image()?.src"
        [alt]="image()?.alt ?? ''"
        [position]="image()?.position ?? 'center'"
        ratio="16 / 9"
        [monogram]="(article().category | label: categories).slice(0, 1)"
        [caption]="article().category | label: categories"
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      />
      <div class="article-card__body">
        <p class="article-card__meta">
          <span class="badge badge--accent">{{ article().category | label: categories }}</span>
          <time [attr.datetime]="article().publishedAt">{{
            article().publishedAt | date: 'mediumDate'
          }}</time>
          <span
            >· <ng-container i18n>{{ article().readingMinutes }} min read</ng-container></span
          >
        </p>
        <h3 class="card__title">
          <a class="card__link" [routerLink]="['/blog', article().slug] | localePath">{{
            article().title
          }}</a>
        </h3>
        <p class="text-muted text-small">{{ article().excerpt }}</p>
      </div>
    </article>
  `,
  styles: `
    .article-card {
      padding: 0;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .article-card {
      --frame-radius: 0;
      --frame-border: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .article-card:hover,
      .article-card:focus-within {
        --frame-zoom: scale(1.04);
      }
    }
    .article-card__body {
      padding: var(--sp-5);
    }
    .article-card__meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--sp-2);
      font-size: var(--fs-xs);
      color: var(--c-text-subtle);
    }
    .card__title {
      font-size: var(--fs-lg);
    }
  `,
})
export class ArticleCard {
  readonly article = input.required<Article>();
  protected readonly categories = ARTICLE_CATEGORY_LABELS;
  protected readonly image = computed(() => articleImage(this.article()));
}
