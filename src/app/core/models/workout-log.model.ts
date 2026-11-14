import { Entity } from './common.model';

/** A user-defined routine built in the workout planner. */
export interface WorkoutRoutine extends Entity {
  readonly ownerId: string;
  readonly name: string;
  readonly sourceProgramId?: string;
  readonly exercises: readonly RoutineExercise[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface RoutineExercise {
  readonly exerciseId: string;
  readonly sets: number;
  readonly reps: string;
  readonly restSeconds: number;
  readonly targetWeightKg?: number;
}

export interface LoggedSet {
  readonly weightKg: number | null;
  readonly reps: number | null;
  readonly completed: boolean;
}

export interface LoggedExercise {
  readonly exerciseId: string;
  readonly targetReps: string;
  readonly restSeconds: number;
  readonly sets: readonly LoggedSet[];
}

export interface WorkoutSession extends Entity {
  readonly ownerId: string;
  readonly routineId?: string;
  readonly name: string;
  readonly startedAt: string;
  readonly completedAt?: string;
  readonly exercises: readonly LoggedExercise[];
  readonly notes?: string;
}
