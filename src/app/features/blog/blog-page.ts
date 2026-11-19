import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ArticleStore } from '../../core/data-access/article.store';
import { ARTICLE_CATEGORY_LABELS, ArticleCategory } from '../../core/models';
import { injectNotFoundStatus } from '../../core/seo/http-status';
import { SeoService } from '../../core/seo/seo.service';
import { ArticleCard } from '../../shared/cards/article-card';
import { CtaSection } from '../../shared/ui/cta-section';
import { PageHero } from '../../shared/ui/page-hero';
import { Paginator, paginate } from '../../shared/ui/paginator';
import { canonicalSlug, lp } from '../../core/i18n/current-locale';
import { LocalePathPipe } from '../../core/i18n/current-locale';

const PAGE_SIZE = 9;

@Component({
  selector: 'app-blog-page',
  imports: [LocalePathPipe, RouterLink, PageHero, ArticleCard, Paginator, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      i18n-eyebrow
      eyebrow="Blog"
      [title]="pageTitle()"
      i18n-lead
      lead="Practical articles on strength training, building muscle and eating for performance, written by a coach who trains every day."
      [breadcrumbs]="crumbs()"
      imageSrc="images/home/dumbbells-apples-clipboard-flat-lay.webp"
      [imageBackground]="true"
      imagePosition="center 50%"
    />

    <section class="section section--tight">
      <div class="container">
        <nav class="categories" i18n-aria-label aria-label="Blog categories">
          <a
            class="chip"
            [attr.href]="href('/blog')"
            (click)="go($event, '/blog')"
            [class.is-active]="!category()"
            [attr.aria-current]="!category() ? 'page' : null"
            i18n
            >All</a
          >
          @for (c of categories; track c[0]) {
            <a
              class="chip"
              [attr.href]="href('/blog/category/' + c[0])"
              (click)="go($event, '/blog/category/' + c[0])"
              [class.is-active]="category() === c[0]"
              [attr.aria-current]="category() === c[0] ? 'page' : null"
              >{{ c[1] }}</a
            >
          }
        </nav>

        @if (visible().length) {
          <div class="grid grid--3 reveal-group">
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
            <h2 i18n>No articles in this category yet</h2>
            <p class="text-muted" i18n>Have a look at all articles in the meantime.</p>
            <a class="btn" [routerLink]="'/blog' | localePath" i18n>All articles</a>
          </div>
        }
      </div>
    </section>

    <app-cta-section
      i18n-eyebrow
      eyebrow="Put it into practice"
      i18n-title
      title="Want a plan instead of more reading?"
      i18n-text
      text="I turn what you read into a plan written for you, with feedback every week."
    />
  `,
  styles: `
    .categories {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-2);
      margin-bottom: var(--sp-6);
    }
    .categories .chip {
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
  private readonly router = inject(Router);
  private readonly locationStrategy = inject(LocationStrategy);

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

  /** Category chips switch the list without jumping back to the top of the page. */
  protected href(canonicalPath: string): string {
    return this.locationStrategy.prepareExternalUrl(lp(canonicalPath));
  }

  protected go(event: MouseEvent, canonicalPath: string): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    void this.router.navigateByUrl(lp(canonicalPath), { scroll: 'manual' });
  }

  protected readonly categoryLabel = computed(() => {
    const c = this.category();
    return c ? (ARTICLE_CATEGORY_LABELS[c as ArticleCategory] ?? '') : '';
  });

  protected readonly filtered = computed(() => {
    const c = this.category();
    return c ? this.articles.byCategory(c as ArticleCategory) : this.articles.published();
  });
  protected readonly visible = computed(() => paginate(this.filtered(), this.page(), PAGE_SIZE));

  protected readonly pageTitle = computed(() => {
    const label = this.categoryLabel();
    return label
      ? $localize`Articles about ${label}:CATEGORY:`
      : $localize`Training and nutrition blog`;
  });

  protected readonly crumbs = computed(() => {
    const base = [{ label: $localize`Blog`, url: '/blog' }];
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
          title: $localize`Category not found`,
          description: $localize`This blog category doesn't exist.`,
          noindex: true,
        });
        return;
      }
      this.seo.update(
        c
          ? {
              title: this.pageTitle(),
              description: $localize`Practical articles about ${this.categoryLabel().toLowerCase()}:CATEGORY: for people who lift: what works, and how to apply it.`,
              path: `/blog/category/${c}`,
            }
          : {
              title: $localize`Training & Nutrition Blog`,
              description: $localize`Practical articles on strength training, muscle building and eating for performance, written by a coach who trains daily.`,
              path: '/blog',
            },
      );
    });
  }
}
