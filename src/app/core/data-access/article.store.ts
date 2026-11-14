import { Injectable, computed } from '@angular/core';
import { ARTICLES } from '../data/articles.data';
import { Article, ArticleCategory } from '../models';
import { EntityStore } from './entity-store';

@Injectable({ providedIn: 'root' })
export class ArticleStore extends EntityStore<Article> {
  readonly published = computed(() =>
    this.all()
      .filter((a) => a.published)
      .slice()
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
  );
  readonly featured = computed(() => this.published().filter((a) => a.featured));

  constructor() {
    super('articles', ARTICLES);
  }

  bySlug(slug: string): Article | undefined {
    return this.published().find((a) => a.slug === slug);
  }

  byCategory(category: ArticleCategory): Article[] {
    return this.published().filter((a) => a.category === category);
  }

  related(article: Article, limit = 3): Article[] {
    const others = this.published().filter((a) => a.id !== article.id);
    const sameCategory = others.filter((a) => a.category === article.category);
    const rest = others.filter((a) => a.category !== article.category);
    return [...sameCategory, ...rest].slice(0, limit);
  }
}
