import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ARTICLE_CATEGORY_LABELS, Article } from '../../core/models';
import { LabelPipe } from '../pipes/format.pipes';
import { MediaFrame } from '../ui/media-frame';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-article-card',
  imports: [LocalePathPipe, RouterLink, DatePipe, LabelPipe, MediaFrame],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card card--interactive article-card">
      <app-media-frame
        [src]="article().featuredImageUrl"
        [alt]="article().featuredImageAlt ?? ''"
        ratio="16 / 9"
        [monogram]="(article().category | label: categories).slice(0, 1)"
        [caption]="article().category | label: categories"
        sizes="(min-width: 1080px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div class="article-card__body">
        <p class="article-card__meta">
          <span class="badge badge--accent">{{ article().category | label: categories }}</span>
          <time [attr.datetime]="article().publishedAt">{{
            article().publishedAt | date: 'mediumDate'
          }}</time>
          <span>· {{ article().readingMinutes }} min read</span>
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
    app-media-frame ::ng-deep .frame {
      border-radius: 0;
      border: 0;
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
}
