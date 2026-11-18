import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExerciseStore } from '../../core/data-access/exercise.store';
import { MuscleStore } from '../../core/data-access/muscle.store';
import {
  DIFFICULTY_LABELS,
  EQUIPMENT_LABELS,
  EXERCISE_CATEGORY_LABELS,
  Exercise,
  MuscleId,
} from '../../core/models';
import { injectNotFoundStatus } from '../../core/seo/http-status';
import { SeoService } from '../../core/seo/seo.service';
import { AnatomyFigure } from '../../shared/anatomy/anatomy-figure';
import { ExerciseCard } from '../../shared/cards/exercise-card';
import { LabelPipe, RestPipe } from '../../shared/pipes/format.pipes';
import { MediaFrame } from '../../shared/ui/media-frame';
import { PageHero } from '../../shared/ui/page-hero';
import { VideoEmbed } from '../../shared/ui/video-embed';
import { NotFoundContent } from '../not-found/not-found-content';
import { canonicalSlug } from '../../core/i18n/current-locale';
import { LocalePathPipe } from '../../core/i18n/current-locale';

const RELATED_LIMIT = 3;

/** Display photos by exercise slug. Kept out of the seed data so structured data stays unchanged. */
const EXERCISE_PHOTOS: Readonly<Record<string, { readonly src: string; readonly alt: string }>> = {
  'dumbbell-curl': {
    src: 'images/home/images.jpeg',
    alt: $localize`Muscular man curling a heavy dumbbell`,
  },
};

@Component({
  selector: 'app-exercise-detail-page',
  imports: [
    LocalePathPipe,
    RouterLink,
    NgOptimizedImage,
    MediaFrame,
    PageHero,
    AnatomyFigure,
    ExerciseCard,
    LabelPipe,
    RestPipe,
    VideoEmbed,
    NotFoundContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './exercise-detail-page.html',
  styleUrl: './exercise-detail-page.scss',
})
export class ExerciseDetailPage {
  private readonly seo = inject(SeoService);
  private readonly exercises = inject(ExerciseStore);
  private readonly muscles = inject(MuscleStore);
  private readonly markNotFound = injectNotFoundStatus();

  readonly slug = input.required<string>();

  protected readonly categoryLabels = EXERCISE_CATEGORY_LABELS;
  protected readonly difficultyLabels = DIFFICULTY_LABELS;
  protected readonly equipmentLabels = EQUIPMENT_LABELS;

  protected readonly exercise = computed(() =>
    this.exercises.all().find((e) => e.slug === canonicalSlug(this.slug())),
  );

  protected readonly photo = computed(() => {
    const slug = this.exercise()?.slug;
    return slug ? (EXERCISE_PHOTOS[slug] ?? null) : null;
  });

  protected readonly primaryNames = computed(() =>
    this.names(this.exercise()?.primaryMuscles ?? []),
  );
  protected readonly secondaryNames = computed(() =>
    this.names(this.exercise()?.secondaryMuscles ?? []),
  );

  protected readonly breadcrumbs = computed(() => {
    const e = this.exercise();
    return [
      { label: $localize`Exercise library`, url: '/exercises' },
      ...(e ? [{ label: e.name, url: `/exercises/${e.slug}` }] : []),
    ];
  });
  protected readonly demoAlt = computed(
    () => $localize`${this.exercise()?.name}:NAME:: demonstration`,
  );
  protected readonly related = computed(() => {
    const current = this.exercise();
    if (!current) return [];
    const target = current.primaryMuscles[0];
    return this.exercises
      .all()
      .filter(
        (e) =>
          e.id !== current.id &&
          (e.primaryMuscles.includes(target) || e.category === current.category),
      )
      .slice(0, RELATED_LIMIT);
  });

  constructor() {
    effect(() => {
      const exercise = this.exercise();
      if (!exercise) {
        this.markNotFound();
        this.seo.update({
          title: $localize`Exercise not found`,
          description: $localize`This exercise doesn't exist or has moved.`,
          noindex: true,
        });
        return;
      }
      this.seo.update({
        title: $localize`${exercise.name}:NAME:: Technique & Muscles Worked`,
        description: $localize`${exercise.summary}:SUMMARY: Technique, muscles worked, sets and reps.`,
        path: `/exercises/${exercise.slug}`,
        image: exercise.media?.imageUrl,
      });
      this.seo.setPageSchema('howto', this.howToSchema(exercise));
    });
  }

  private names(ids: readonly MuscleId[]): { id: MuscleId; name: string }[] {
    return ids.map((id) => ({ id, name: this.muscles.get(id)?.name ?? id }));
  }

  /** HowTo markup mirrors the visible step-by-step instructions on the page. */
  private howToSchema(exercise: Exercise): Record<string, unknown> {
    return {
      '@type': 'HowTo',
      name: `How to perform the ${exercise.name}`,
      description: exercise.summary,
      tool: exercise.equipment.map((e) => ({ '@type': 'HowToTool', name: EQUIPMENT_LABELS[e] })),
      step: [exercise.startingPosition, ...exercise.execution, exercise.endingPosition].map(
        (text, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          text,
        }),
      ),
    };
  }
}
