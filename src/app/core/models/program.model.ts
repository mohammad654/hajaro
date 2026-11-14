import { DifficultyLevel, Sluggable } from './common.model';
import { Equipment } from './exercise.model';
import { MuscleId } from './muscle.model';

export type ProgramGoal =
  'muscle-gain' | 'strength' | 'fat-loss' | 'recomposition' | 'general-fitness';

export const PROGRAM_GOAL_LABELS: Readonly<Record<ProgramGoal, string>> = {
  'muscle-gain': 'Muscle gain',
  strength: 'Strength',
  'fat-loss': 'Fat loss',
  recomposition: 'Recomposition',
  'general-fitness': 'General fitness',
};

export type TrainingType = 'full-body' | 'split' | 'upper-lower' | 'push-pull-legs' | 'home';

export const TRAINING_TYPE_LABELS: Readonly<Record<TrainingType, string>> = {
  'full-body': 'Full body',
  split: 'Body-part split',
  'upper-lower': 'Upper / lower',
  'push-pull-legs': 'Push / pull / legs',
  home: 'Home training',
};

/** A single prescribed exercise inside a workout day. */
export interface WorkoutExercise {
  readonly exerciseId: string;
  readonly sets: string;
  readonly reps: string;
  readonly restSeconds: number;
  readonly notes?: string;
}

export interface WorkoutDay {
  readonly id: string;
  /** e.g. "Day 1", "Monday" */
  readonly label: string;
  /** e.g. "Push — chest, shoulders, triceps" */
  readonly focus: string;
  /** A rest/recovery day has no exercises. */
  readonly isRestDay: boolean;
  readonly exercises: readonly WorkoutExercise[];
}

export interface TrainingProgram extends Sluggable {
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly level: DifficultyLevel;
  readonly goal: ProgramGoal;
  readonly trainingType: TrainingType;
  readonly daysPerWeek: number;
  readonly durationWeeks: number;
  readonly sessionMinutes: string;
  readonly targetAudience: readonly string[];
  readonly equipment: readonly Equipment[];
  readonly structure: readonly string[];
  readonly warmUp: readonly string[];
  readonly progression: readonly string[];
  readonly recovery: readonly string[];
  readonly schedule: readonly WorkoutDay[];
  readonly featured?: boolean;
  /** Optional price for a self-guided purchase; omitted programs are coaching-only. */
  readonly price?: number;
}

/** A row of the full-body workout chart. */
export interface WorkoutChartRow {
  readonly muscleGroup: string;
  readonly muscleId: MuscleId;
  readonly exerciseId: string;
  readonly sets: string;
  readonly reps: string;
}
