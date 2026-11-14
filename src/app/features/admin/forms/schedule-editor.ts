import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { newId } from '../../../core/api/entity-repository';
import { ExerciseStore } from '../../../core/data-access/exercise.store';
import { WorkoutDay, WorkoutExercise } from '../../../core/models';
import { Icon } from '../../../shared/ui/icon/icon';

export type ExerciseGroup = FormGroup<{
  exerciseId: FormControl<string>;
  sets: FormControl<string>;
  reps: FormControl<string>;
  restSeconds: FormControl<number>;
  notes: FormControl<string>;
}>;

export type DayGroup = FormGroup<{
  id: FormControl<string>;
  label: FormControl<string>;
  focus: FormControl<string>;
  isRestDay: FormControl<boolean>;
  exercises: FormArray<ExerciseGroup>;
}>;

const MAX_REST_SECONDS = 600;

function exerciseGroup(e?: WorkoutExercise): ExerciseGroup {
  return new FormGroup({
    exerciseId: new FormControl(e?.exerciseId ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    sets: new FormControl(e?.sets ?? '3', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(10)],
    }),
    reps: new FormControl(e?.reps ?? '8–12', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
    restSeconds: new FormControl(e?.restSeconds ?? 90, {
      nonNullable: true,
      validators: [Validators.min(0), Validators.max(MAX_REST_SECONDS)],
    }),
    notes: new FormControl(e?.notes ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(120)],
    }),
  });
}

function dayGroup(day?: WorkoutDay): DayGroup {
  return new FormGroup({
    id: new FormControl(day?.id ?? newId('day'), { nonNullable: true }),
    label: new FormControl(day?.label ?? 'Day', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    focus: new FormControl(day?.focus ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(80)],
    }),
    isRestDay: new FormControl(day?.isRestDay ?? false, { nonNullable: true }),
    exercises: new FormArray((day?.exercises ?? []).map((e) => exerciseGroup(e))),
  });
}

export function buildScheduleArray(days: readonly WorkoutDay[]): FormArray<DayGroup> {
  return new FormArray(days.map((d) => dayGroup(d)));
}

export function readSchedule(array: FormArray<DayGroup>): WorkoutDay[] {
  return array.getRawValue().map((d) => ({
    id: d.id,
    label: d.label.trim(),
    focus: d.isRestDay ? d.focus.trim() || 'Rest & recovery' : d.focus.trim(),
    isRestDay: d.isRestDay,
    exercises: d.isRestDay
      ? []
      : d.exercises.map((e) => ({
          exerciseId: e.exerciseId,
          sets: e.sets.trim(),
          reps: e.reps.trim(),
          restSeconds: e.restSeconds,
          ...(e.notes.trim() ? { notes: e.notes.trim() } : {}),
        })),
  }));
}

/**
 * Workout chart builder used for programs and individual client plans:
 * add/remove days, mark rest days, and set exercises, sets, reps, rest and notes.
 */
@Component({
  selector: 'app-schedule-editor',
  imports: [ReactiveFormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-editor.html',
  styleUrl: './schedule-editor.scss',
})
export class ScheduleEditor {
  protected readonly exercises = inject(ExerciseStore);
  readonly days = input.required<FormArray<DayGroup>>();

  protected addDay(): void {
    this.days().push(
      dayGroup({
        id: newId('day'),
        label: `Day ${this.days().length + 1}`,
        focus: '',
        isRestDay: false,
        exercises: [],
      }),
    );
    this.days().markAsDirty();
  }

  protected removeDay(index: number): void {
    this.days().removeAt(index);
    this.days().markAsDirty();
  }

  protected moveDay(index: number, delta: -1 | 1): void {
    const target = index + delta;
    const days = this.days();
    if (target < 0 || target >= days.length) return;
    const day = days.at(index);
    days.removeAt(index);
    days.insert(target, day);
    days.markAsDirty();
  }

  protected addExercise(day: DayGroup): void {
    day.controls.exercises.push(exerciseGroup());
    day.markAsDirty();
  }

  protected removeExercise(day: DayGroup, index: number): void {
    day.controls.exercises.removeAt(index);
    day.markAsDirty();
  }

  protected moveExercise(day: DayGroup, index: number, delta: -1 | 1): void {
    const list = day.controls.exercises;
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    const item = list.at(index);
    list.removeAt(index);
    list.insert(target, item);
    day.markAsDirty();
  }
}
