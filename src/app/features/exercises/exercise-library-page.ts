import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { ExerciseStore } from '../../core/data-access/exercise.store';
import { MuscleStore } from '../../core/data-access/muscle.store';
import { ClientReady } from '../../core/services/client-ready';
import {
  DIFFICULTY_LABELS,
  DifficultyLevel,
  EQUIPMENT_LABELS,
  EXERCISE_CATEGORY_LABELS,
  Equipment,
  Exercise,
  ExerciseCategory,
} from '../../core/models';
import { applyPageSeo } from '../../core/seo/page-seo';
import { ExerciseCard } from '../../shared/cards/exercise-card';
import { Icon } from '../../shared/ui/icon/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { Paginator, paginate } from '../../shared/ui/paginator';

const PAGE_SIZE = 12;

@Component({
  selector: 'app-exercise-library-page',
  imports: [PageHero, ExerciseCard, Icon, Paginator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './exercise-library-page.html',
  styleUrl: './exercise-library-page.scss',
})
export class ExerciseLibraryPage {
  private readonly exercises = inject(ExerciseStore);
  protected readonly muscles = inject(MuscleStore);
  private readonly ready = inject(ClientReady).ready;

  /** Deep-link support, e.g. /exercises?category=chest or ?muscle=lats */
  readonly categoryParam = input<string | undefined>(undefined, { alias: 'category' });
  readonly muscleParam = input<string | undefined>(undefined, { alias: 'muscle' });

  protected readonly categories = Object.entries(EXERCISE_CATEGORY_LABELS) as [
    ExerciseCategory,
    string,
  ][];
  protected readonly equipmentOptions = Object.entries(EQUIPMENT_LABELS) as [Equipment, string][];
  protected readonly difficultyOptions = Object.entries(DIFFICULTY_LABELS) as [
    DifficultyLevel,
    string,
  ][];

  protected readonly breadcrumbs = [{ label: $localize`Exercise library`, url: '/exercises' }];
  protected readonly query = signal('');
  protected readonly category = linkedSignal<ExerciseCategory | ''>(() => {
    const param = this.ready() ? this.categoryParam() : undefined;
    return param && param in EXERCISE_CATEGORY_LABELS ? (param as ExerciseCategory) : '';
  });
  protected readonly muscle = linkedSignal<string>(() => {
    const param = this.ready() ? this.muscleParam() : undefined;
    return this.muscles.isMuscleId(param) ? param : '';
  });
  protected readonly equipment = signal<Equipment | ''>('');
  protected readonly difficulty = signal<DifficultyLevel | ''>('');
  protected readonly page = linkedSignal({
    source: () => [
      this.query(),
      this.category(),
      this.muscle(),
      this.equipment(),
      this.difficulty(),
    ],
    computation: () => 1,
  });

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.exercises.all().filter((exercise) => this.matches(exercise, q));
  });

  protected readonly visible = computed(() => paginate(this.filtered(), this.page(), PAGE_SIZE));
  protected readonly pageSize = PAGE_SIZE;

  constructor() {
    applyPageSeo('exercises', {
      title: $localize`Exercise Library: Technique & Muscles Worked`,
      description: $localize`Search exercises for chest, back, shoulders, arms, legs, glutes, abs and cardio, with technique cues, sets, reps and safety tips.`,
    });
  }

  protected toggleCategory(value: ExerciseCategory | ''): void {
    this.category.set(this.category() === value ? '' : value);
  }

  protected readValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected reset(): void {
    this.query.set('');
    this.category.set('');
    this.muscle.set('');
    this.equipment.set('');
    this.difficulty.set('');
  }

  private matches(exercise: Exercise, q: string): boolean {
    if (this.category() && exercise.category !== this.category()) return false;
    if (this.difficulty() && exercise.difficulty !== this.difficulty()) return false;
    const equipment = this.equipment();
    if (equipment && !exercise.equipment.includes(equipment)) return false;
    const muscle = this.muscle();
    if (
      muscle &&
      !exercise.primaryMuscles.some((m) => m === muscle) &&
      !exercise.secondaryMuscles.some((m) => m === muscle)
    ) {
      return false;
    }
    if (!q) return true;
    const haystack = [
      exercise.name,
      exercise.summary,
      ...exercise.primaryMuscles.map((m) => this.muscles.get(m)?.name ?? m),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  }
}
