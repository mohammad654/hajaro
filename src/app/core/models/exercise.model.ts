import { DifficultyLevel, Sluggable } from './common.model';
import { MuscleId } from './muscle.model';

export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'glutes'
  | 'abs'
  | 'full-body'
  | 'cardio';

export const EXERCISE_CATEGORY_LABELS: Readonly<Record<ExerciseCategory, string>> = {
  chest: $localize`Chest`,
  back: $localize`Back`,
  shoulders: $localize`Shoulders`,
  biceps: $localize`Biceps`,
  triceps: $localize`Triceps`,
  legs: $localize`Legs`,
  glutes: $localize`Glutes`,
  abs: $localize`Abs`,
  'full-body': $localize`Full Body`,
  cardio: $localize`Cardio`,
};

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'bench'
  | 'pull-up-bar'
  | 'kettlebell'
  | 'resistance-band'
  | 'smith-machine'
  | 'cardio-machine';

export const EQUIPMENT_LABELS: Readonly<Record<Equipment, string>> = {
  barbell: $localize`Barbell`,
  dumbbell: $localize`Dumbbells`,
  cable: $localize`Cable station`,
  machine: $localize`Machine`,
  bodyweight: $localize`Bodyweight`,
  bench: $localize`Bench`,
  'pull-up-bar': $localize`Pull-up bar`,
  kettlebell: $localize`Kettlebell`,
  'resistance-band': $localize`Resistance band`,
  'smith-machine': $localize`Smith machine`,
  'cardio-machine': $localize`Cardio machine`,
};

export interface ExerciseMedia {
  /** Optional demonstration image path (WebP/AVIF preferred). */
  readonly imageUrl?: string;
  readonly imageAlt?: string;
  /** Optional embed URL (YouTube or Vimeo). Validated before rendering. */
  readonly videoUrl?: string;
}

export interface Exercise extends Sluggable {
  readonly name: string;
  readonly category: ExerciseCategory;
  readonly primaryMuscles: readonly MuscleId[];
  readonly secondaryMuscles: readonly MuscleId[];
  readonly equipment: readonly Equipment[];
  readonly difficulty: DifficultyLevel;
  readonly summary: string;
  readonly startingPosition: string;
  readonly execution: readonly string[];
  readonly endingPosition: string;
  readonly postureCues: readonly string[];
  readonly recommendedSets: string;
  readonly recommendedReps: string;
  readonly restSeconds: number;
  readonly commonMistakes: readonly string[];
  readonly safety: readonly string[];
  readonly media?: ExerciseMedia;
}
