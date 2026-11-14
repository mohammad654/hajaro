import { Injectable } from '@angular/core';
import { EXERCISES } from '../data/exercises.data';
import { Exercise, MuscleId } from '../models';
import { EntityStore } from './entity-store';

@Injectable({ providedIn: 'root' })
export class ExerciseStore extends EntityStore<Exercise> {
  constructor() {
    super('exercises', EXERCISES);
  }

  /** Exercises grouped by whether the muscle is a primary or secondary mover. */
  forMuscle(muscleId: MuscleId): { primary: Exercise[]; secondary: Exercise[] } {
    const primary: Exercise[] = [];
    const secondary: Exercise[] = [];
    for (const exercise of this.all()) {
      if (exercise.primaryMuscles.includes(muscleId)) primary.push(exercise);
      else if (exercise.secondaryMuscles.includes(muscleId)) secondary.push(exercise);
    }
    return { primary, secondary };
  }
}
