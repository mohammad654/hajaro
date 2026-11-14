import { Sluggable } from './common.model';

export type ArticleCategory =
  | 'bodybuilding'
  | 'muscle-growth'
  | 'strength-training'
  | 'nutrition'
  | 'fat-loss'
  | 'exercise-technique'
  | 'recovery'
  | 'supplements'
  | 'motivation';

export const ARTICLE_CATEGORY_LABELS: Readonly<Record<ArticleCategory, string>> = {
  bodybuilding: 'Bodybuilding',
  'muscle-growth': 'Muscle Growth',
  'strength-training': 'Strength Training',
  nutrition: 'Nutrition',
  'fat-loss': 'Fat Loss',
  'exercise-technique': 'Exercise Techniques',
  recovery: 'Recovery',
  supplements: 'Supplements',
  motivation: 'Fitness Motivation',
};

/**
 * Articles are stored as structured blocks rather than raw HTML.
 * This keeps rendering XSS-safe and lets the table of contents be generated from headings.
 */
export type ArticleBlock =
  | { readonly type: 'h2' | 'h3'; readonly text: string; readonly id: string }
  | { readonly type: 'p'; readonly text: string }
  | { readonly type: 'ul' | 'ol'; readonly items: readonly string[] }
  | { readonly type: 'callout'; readonly text: string }
  | { readonly type: 'link'; readonly text: string; readonly href: string };

export interface Article extends Sluggable {
  readonly title: string;
  readonly seoTitle: string;
  readonly metaDescription: string;
  readonly excerpt: string;
  readonly category: ArticleCategory;
  readonly author: string;
  readonly publishedAt: string;
  readonly updatedAt: string;
  readonly readingMinutes: number;
  readonly featuredImageUrl?: string;
  readonly featuredImageAlt?: string;
  readonly body: readonly ArticleBlock[];
  readonly tags: readonly string[];
  readonly featured?: boolean;
  readonly published: boolean;
}
