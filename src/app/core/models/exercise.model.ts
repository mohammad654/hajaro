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
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  legs: 'Legs',
  glutes: 'Glutes',
  abs: 'Abs',
  'full-body': 'Full Body',
  cardio: 'Cardio',
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
  barbell: 'Barbell',
  dumbbell: 'Dumbbells',
  cable: 'Cable station',
  machine: 'Machine',
  bodyweight: 'Bodyweight',
  bench: 'Bench',
  'pull-up-bar': 'Pull-up bar',
  kettlebell: 'Kettlebell',
  'resistance-band': 'Resistance band',
  'smith-machine': 'Smith machine',
  'cardio-machine': 'Cardio machine',
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
