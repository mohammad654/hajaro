import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleStore } from '../../core/data-access/article.store';
import { ARTICLE_CATEGORY_LABELS, ArticleCategory } from '../../core/models';
import { injectNotFoundStatus } from '../../core/seo/http-status';
import { SeoService } from '../../core/seo/seo.service';
import { ArticleCard } from '../../shared/cards/article-card';
import { CtaSection } from '../../shared/ui/cta-section';
import { PageHero } from '../../shared/ui/page-hero';
import { Paginator, paginate } from '../../shared/ui/paginator';
import { canonicalSlug } from '../../core/i18n/current-locale';
import { LocalePathPipe } from '../../core/i18n/current-locale';

const PAGE_SIZE = 9;

@Component({
  selector: 'app-blog-page',
  imports: [LocalePathPipe, RouterLink, PageHero, ArticleCard, Paginator, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      eyebrow="Fitness education"
      [title]="categoryLabel() ? categoryLabel() + ' articles' : 'The training & nutrition blog'"
      lead="Evidence-based articles on bodybuilding, muscle growth, strength, nutrition, fat loss, recovery and more — written to help you train smarter."
      [breadcrumbs]="crumbs()"
    />

    <section class="section section--tight">
      <div class="container">
        <nav class="categories" aria-label="Blog categories">
          <a
            class="chip"
            [routerLink]="'/blog' | localePath"
            [class.is-active]="!category()"
            [attr.aria-current]="!category() ? 'page' : null"
            >All</a
          >
          @for (c of categories; track c[0]) {
            <a
              class="chip"
              [routerLink]="['/blog/category', c[0]] | localePath"
              [class.is-active]="category() === c[0]"
              [attr.aria-current]="category() === c[0] ? 'page' : null"
              >{{ c[1] }}</a
            >
          }
        </nav>

        @if (visible().length) {
          <div class="grid grid--3">
            @for (article of visible(); track article.id) {
              <app-article-card [article]="article" />
            }
          </div>
          <app-paginator
            [page]="page()"
            [pageSize]="pageSize"
            [total]="filtered().length"
            (pageChange)="page.set($event)"
          />
        } @else {
          <div class="card empty">
            <h2>No articles in this category yet</h2>
            <p class="text-muted">
              New articles are published regularly. Browse all articles in the meantime.
            </p>
            <a class="btn" [routerLink]="'/blog' | localePath">All articles</a>
          </div>
        }
      </div>
    </section>

    <app-cta-section
      eyebrow="Put it into practice"
      title="Knowledge is good. Coaching is faster."
      text="Turn what you read into a plan built for you — with weekly feedback from your coach."
    />
  `,
  styles: `
    .categories {
      display: flex;
      gap: var(--sp-2);
      overflow-x: auto;
      padding-bottom: var(--sp-2);
      margin-bottom: var(--sp-6);
    }
    .categories .chip {
      flex-shrink: 0;
      text-decoration: none;
    }
    .empty {
      text-align: center;
    }
  `,
})
export class BlogPage {
  private readonly articles = inject(ArticleStore);
  private readonly seo = inject(SeoService);
  private readonly markNotFound = injectNotFoundStatus();

  /** Route param on /blog/category/:category (public, per-language slug); undefined on /blog. */
  readonly categoryParam = input<string | undefined>(undefined, { alias: 'category' });
  /** Canonical category key. */
  protected readonly category = computed(() => {
    const param = this.categoryParam();
    return param === undefined ? undefined : canonicalSlug(param);
  });

  protected readonly categories = Object.entries(ARTICLE_CATEGORY_LABELS) as [
    ArticleCategory,
    string,
  ][];
  protected readonly pageSize = PAGE_SIZE;
  protected readonly page = signal(1);

  protected readonly categoryLabel = computed(() => {
    const c = this.category();
    return c ? (ARTICLE_CATEGORY_LABELS[c as ArticleCategory] ?? '') : '';
  });

  protected readonly filtered = computed(() => {
    const c = this.category();
    return c ? this.articles.byCategory(c as ArticleCategory) : this.articles.published();
  });
  protected readonly visible = computed(() => paginate(this.filtered(), this.page(), PAGE_SIZE));

  protected readonly crumbs = computed(() => {
    const base = [{ label: 'Blog', url: '/blog' }];
    const c = this.category();
    return c && this.categoryLabel()
      ? [...base, { label: this.categoryLabel(), url: `/blog/category/${c}` }]
      : base;
  });

  constructor() {
    effect(() => {
      const c = this.category();
      if (c && !this.categoryLabel()) {
        this.markNotFound();
        this.seo.update({
          title: 'Category not found',
          description: 'This blog category does not exist.',
          noindex: true,
        });
        return;
      }
      this.seo.update(
        c
          ? {
              title: `${this.categoryLabel()} Articles`,
              description: `Evidence-based ${this.categoryLabel().toLowerCase()} articles for lifters and bodybuilders: practical advice to train smarter and progress faster.`,
              path: `/blog/category/${c}`,
            }
          : {
              title: 'Bodybuilding, Training & Nutrition Blog',
              description:
                'Evidence-based articles on bodybuilding, muscle growth, strength training, nutrition, fat loss, exercise technique, recovery, supplements and motivation.',
              path: '/blog',
            },
      );
    });
  }
}
