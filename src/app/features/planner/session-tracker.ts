import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseStore } from '../../core/data-access/exercise.store';
import { LoggedSet, WorkoutSession } from '../../core/models';
import { RestPipe } from '../../shared/pipes/format.pipes';
import { Icon } from '../../shared/ui/icon/icon';
import { sessionStats } from './planner.utils';

const MAX_WEIGHT_KG = 1000;
const MAX_REPS = 200;

/** Live workout logging: record weight and reps per set and tick sets off as you go. */
@Component({
  selector: 'app-session-tracker',
  imports: [RouterLink, RestPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './session-tracker.html',
  styleUrl: './session-tracker.scss',
})
export class SessionTracker {
  protected readonly exercises = inject(ExerciseStore);

  readonly session = input.required<WorkoutSession>();
  readonly saving = input(false);
  readonly changed = output<WorkoutSession>();
  readonly finished = output<WorkoutSession>();
  readonly discarded = output<void>();

  protected readonly stats = computed(() => sessionStats(this.session()));

  protected updateSet(exerciseIndex: number, setIndex: number, changes: Partial<LoggedSet>): void {
    const session = this.session();
    this.changed.emit({
      ...session,
      exercises: session.exercises.map((exercise, i) =>
        i !== exerciseIndex
          ? exercise
          : {
              ...exercise,
              sets: exercise.sets.map((set, j) => (j === setIndex ? { ...set, ...changes } : set)),
            },
      ),
    });
  }

  protected setNumber(
    exerciseIndex: number,
    setIndex: number,
    field: 'weightKg' | 'reps',
    event: Event,
  ): void {
    const raw = (event.target as HTMLInputElement).value;
    const max = field === 'weightKg' ? MAX_WEIGHT_KG : MAX_REPS;
    const value = raw === '' ? null : Math.min(Math.max(0, Number(raw)), max);
    this.updateSet(exerciseIndex, setIndex, { [field]: Number.isFinite(value) ? value : null });
  }

  protected toggle(exerciseIndex: number, setIndex: number, set: LoggedSet): void {
    this.updateSet(exerciseIndex, setIndex, { completed: !set.completed });
  }

  protected addSet(exerciseIndex: number): void {
    const session = this.session();
    this.changed.emit({
      ...session,
      exercises: session.exercises.map((exercise, i) => {
        if (i !== exerciseIndex) return exercise;
        const last = exercise.sets.at(-1);
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            { weightKg: last?.weightKg ?? null, reps: null, completed: false },
          ],
        };
      }),
    });
  }

  protected setNotes(event: Event): void {
    this.changed.emit({
      ...this.session(),
      notes: (event.target as HTMLTextAreaElement).value.slice(0, 1000),
    });
  }

  protected finish(): void {
    this.finished.emit({ ...this.session(), completedAt: new Date().toISOString() });
  }
}
