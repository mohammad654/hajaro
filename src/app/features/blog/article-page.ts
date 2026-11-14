import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleStore } from '../../core/data-access/article.store';
import { ARTICLE_CATEGORY_LABELS, ArticleBlock } from '../../core/models';
import { injectNotFoundStatus } from '../../core/seo/http-status';
import { articleSchema } from '../../core/seo/schema.builders';
import { SeoService } from '../../core/seo/seo.service';
import { ArticleCard } from '../../shared/cards/article-card';
import { LabelPipe } from '../../shared/pipes/format.pipes';
import { Breadcrumbs } from '../../shared/ui/breadcrumbs';
import { CtaSection } from '../../shared/ui/cta-section';
import { MediaFrame } from '../../shared/ui/media-frame';
import { NotFoundContent } from '../not-found/not-found-content';
import { ShareLinks } from './share-links';

type HeadingBlock = Extract<ArticleBlock, { type: 'h2' | 'h3' }>;

/** Uniform shape for rendering every block type without casts in the template. */
interface ViewBlock {
  readonly type: ArticleBlock['type'];
  readonly text?: string;
  readonly id?: string;
  readonly items?: readonly string[];
  readonly href?: string;
}

@Component({
  selector: 'app-article-page',
  imports: [
    RouterLink,
    DatePipe,
    LabelPipe,
    Breadcrumbs,
    MediaFrame,
    ArticleCard,
    CtaSection,
    NotFoundContent,
    ShareLinks,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
})
export class ArticlePage {
  private readonly articles = inject(ArticleStore);
  private readonly seo = inject(SeoService);
  private readonly markNotFound = injectNotFoundStatus();

  readonly slug = input.required<string>();

  protected readonly categories = ARTICLE_CATEGORY_LABELS;
  protected readonly article = computed(() => this.articles.bySlug(this.slug()));
  protected readonly blocks = computed<readonly ViewBlock[]>(() => this.article()?.body ?? []);
  protected readonly toc = computed(
    () =>
      (this.article()?.body.filter((b) => b.type === 'h2' || b.type === 'h3') ??
        []) as HeadingBlock[],
  );
  protected readonly related = computed(() => {
    const a = this.article();
    return a ? this.articles.related(a) : [];
  });
  protected readonly url = computed(() => this.seo.absoluteUrl(`/blog/${this.slug()}`));

  constructor() {
    effect(() => {
      const article = this.article();
      if (!article) {
        this.markNotFound();
        this.seo.update({
          title: 'Article not found',
          description: 'This article could not be found.',
          noindex: true,
        });
        return;
      }
      this.seo.update({
        title: article.seoTitle,
        description: article.metaDescription,
        path: `/blog/${article.slug}`,
        type: 'article',
        image: article.featuredImageUrl,
        imageAlt: article.featuredImageAlt,
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
      });
      this.seo.setPageSchema(
        'article',
        articleSchema((p) => this.seo.absoluteUrl(p), article),
      );
    });
  }

  /** Internal links use the router; anything else opens safely in a new tab. */
  protected isInternal(href: string): boolean {
    return href.startsWith('/') && !href.startsWith('//');
  }

  protected splitPath(href: string): { path: string; query: Record<string, string> } {
    const [path, query = ''] = href.split('?');
    return { path, query: Object.fromEntries(new URLSearchParams(query)) };
  }
}
