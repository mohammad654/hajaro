import { newId } from '../../core/api/entity-repository';
import {
  LoggedExercise,
  RoutineExercise,
  WorkoutChartRow,
  WorkoutDay,
  WorkoutRoutine,
  WorkoutSession,
} from '../../core/models';

const DEFAULT_SETS = 3;

/** Storage key for an unfinished workout, so it survives refreshes. */
export const activeSessionKey = (ownerId: string) => `planner:active:${ownerId}`;
const DEFAULT_REST_SECONDS = 90;

/** "3–4" → 4, "3" → 3, anything else → default. Uses the upper bound of a range. */
export function parseSetCount(sets: string): number {
  const numbers = sets.match(/\d+/g)?.map(Number) ?? [];
  return numbers.length ? Math.max(...numbers) : DEFAULT_SETS;
}

export function routineExerciseFrom(
  exerciseId: string,
  sets = DEFAULT_SETS,
  reps = '8–12',
  restSeconds = DEFAULT_REST_SECONDS,
): RoutineExercise {
  return { exerciseId, sets, reps, restSeconds };
}

export function exercisesFromDay(day: WorkoutDay): RoutineExercise[] {
  return day.exercises.map((e) =>
    routineExerciseFrom(
      e.exerciseId,
      parseSetCount(e.sets),
      e.reps,
      e.restSeconds || DEFAULT_REST_SECONDS,
    ),
  );
}

export function exercisesFromChart(rows: readonly WorkoutChartRow[]): RoutineExercise[] {
  return rows.map((row) => routineExerciseFrom(row.exerciseId, parseSetCount(row.sets), row.reps));
}

export function createRoutine(
  ownerId: string,
  name: string,
  exercises: readonly RoutineExercise[],
  sourceProgramId?: string,
): WorkoutRoutine {
  const now = new Date().toISOString();
  return {
    id: newId('routine'),
    ownerId,
    name,
    exercises,
    createdAt: now,
    updatedAt: now,
    ...(sourceProgramId ? { sourceProgramId } : {}),
  };
}

export function startSession(ownerId: string, routine: WorkoutRoutine): WorkoutSession {
  return {
    id: newId('session'),
    ownerId,
    routineId: routine.id,
    name: routine.name,
    startedAt: new Date().toISOString(),
    exercises: routine.exercises.map((e): LoggedExercise => ({
      exerciseId: e.exerciseId,
      targetReps: e.reps,
      restSeconds: e.restSeconds,
      sets: Array.from({ length: Math.max(1, e.sets) }, () => ({
        weightKg: e.targetWeightKg ?? null,
        reps: null,
        completed: false,
      })),
    })),
  };
}

export interface SessionStats {
  readonly completedSets: number;
  readonly totalSets: number;
  readonly percent: number;
  readonly volumeKg: number;
}

export function sessionStats(session: WorkoutSession): SessionStats {
  let completedSets = 0;
  let totalSets = 0;
  let volumeKg = 0;
  for (const exercise of session.exercises) {
    for (const set of exercise.sets) {
      totalSets++;
      if (set.completed) {
        completedSets++;
        volumeKg += (set.weightKg ?? 0) * (set.reps ?? 0);
      }
    }
  }
  return {
    completedSets,
    totalSets,
    percent: totalSets ? Math.round((completedSets / totalSets) * 100) : 0,
    volumeKg: Math.round(volumeKg),
  };
}
