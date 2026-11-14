/** Every persisted entity has a stable string identifier. */
export interface Entity {
  readonly id: string;
}

/** Entities that are addressable by a public, SEO-friendly URL segment. */
export interface Sluggable extends Entity {
  readonly slug: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export const DIFFICULTY_LABELS: Readonly<Record<DifficultyLevel, string>> = {
  beginner: $localize`Beginner`,
  intermediate: $localize`Intermediate`,
  advanced: $localize`Advanced`,
};

export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface Option<T extends string = string> {
  readonly value: T;
  readonly label: string;
}
