import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExerciseStore } from '../../core/data-access/exercise.store';
import { MuscleStore } from '../../core/data-access/muscle.store';
import { ProgramStore } from '../../core/data-access/program.store';
import { FULL_BODY_WORKOUT_CHART } from '../../core/data/programs.data';
import { MuscleId, RoutineExercise, WorkoutRoutine } from '../../core/models';
import { FieldError } from '../../shared/forms/field-error';
import { Icon } from '../../shared/ui/icon/icon';
import { exercisesFromChart, exercisesFromDay, routineExerciseFrom } from './planner.utils';

const MAX_SETS = 12;
const MAX_REST_SECONDS = 600;
const MAX_WEIGHT_KG = 1000;
const PICKER_LIMIT = 30;
export const CHART_TEMPLATE_ID = 'full-body-chart';

type ExerciseRow = FormGroup<{
  exerciseId: FormControl<string>;
  sets: FormControl<number>;
  reps: FormControl<string>;
  restSeconds: FormControl<number>;
  targetWeightKg: FormControl<number | null>;
}>;

export interface RoutineDraft {
  readonly name: string;
  readonly exercises: readonly RoutineExercise[];
  readonly sourceProgramId?: string;
}

@Component({
  selector: 'app-routine-builder',
  imports: [ReactiveFormsModule, FieldError, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './routine-builder.html',
  styleUrl: './routine-builder.scss',
})
export class RoutineBuilder implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly exercises = inject(ExerciseStore);
  protected readonly muscles = inject(MuscleStore);
  protected readonly programs = inject(ProgramStore);

  /** Existing routine to edit, or null for a new one. */
  readonly routine = input<WorkoutRoutine | null>(null);
  /** Optional initial content (from a program, the chart or an exercise link). */
  readonly initial = input<RoutineDraft | null>(null);
  readonly initialMuscle = input<MuscleId | null>(null);
  readonly saving = input(false);

  readonly save = output<RoutineDraft>();
  readonly cancelled = output<void>();

  protected readonly form = this.fb.group({
    name: this.fb.control('', [Validators.required, Validators.maxLength(60)]),
    exercises: this.fb.array<ExerciseRow>([]),
  });

  protected readonly muscleFilter = signal<MuscleId | ''>('');
  protected readonly search = signal('');
  protected readonly selectedIds = signal<readonly string[]>([]);
  private sourceProgramId: string | undefined;

  protected readonly templates = computed(() => [
    { id: CHART_TEMPLATE_ID, label: 'Full body workout chart' },
    ...this.programs
      .all()
      .flatMap((p) =>
        p.schedule
          .filter((d) => !d.isRestDay)
          .map((d) => ({ id: `${p.id}::${d.id}`, label: `${p.name} — ${d.label}: ${d.focus}` })),
      ),
  ]);

  protected readonly pickerResults = computed(() => {
    const muscle = this.muscleFilter();
    const q = this.search().trim().toLowerCase();
    return this.exercises
      .all()
      .filter(
        (e) => !muscle || e.primaryMuscles.includes(muscle) || e.secondaryMuscles.includes(muscle),
      )
      .filter((e) => !q || e.name.toLowerCase().includes(q))
      .slice(0, PICKER_LIMIT);
  });

  get rows(): FormArray<ExerciseRow> {
    return this.form.controls.exercises;
  }

  ngOnInit(): void {
    const routine = this.routine();
    const initial = this.initial();
    if (routine) {
      this.form.controls.name.setValue(routine.name);
      routine.exercises.forEach((e) => this.addRow(e));
      this.sourceProgramId = routine.sourceProgramId;
    } else if (initial) {
      this.form.controls.name.setValue(initial.name);
      initial.exercises.forEach((e) => this.addRow(e));
      this.sourceProgramId = initial.sourceProgramId;
    }
    this.muscleFilter.set(this.initialMuscle() ?? '');
  }

  protected applyTemplate(templateId: string): void {
    if (!templateId) return;
    if (templateId === CHART_TEMPLATE_ID) {
      this.replaceRows(exercisesFromChart(FULL_BODY_WORKOUT_CHART), 'Full body workout');
      return;
    }
    const [programId, dayId] = templateId.split('::');
    const program = this.programs.get(programId);
    const day = program?.schedule.find((d) => d.id === dayId);
    if (program && day) {
      this.sourceProgramId = program.id;
      this.replaceRows(exercisesFromDay(day), `${program.name} — ${day.focus}`);
    }
  }

  protected addExercise(exerciseId: string): void {
    const exercise = this.exercises.get(exerciseId);
    if (!exercise) return;
    this.addRow(
      routineExerciseFrom(exercise.id, 3, exercise.recommendedReps, exercise.restSeconds || 90),
    );
  }

  protected removeRow(index: number): void {
    this.rows.removeAt(index);
    this.syncSelected();
  }

  protected move(index: number, delta: -1 | 1): void {
    const target = index + delta;
    if (target < 0 || target >= this.rows.length) return;
    const row = this.rows.at(index);
    this.rows.removeAt(index);
    this.rows.insert(target, row);
  }

  protected exerciseName(id: string): string {
    return this.exercises.get(id)?.name ?? id;
  }

  protected readValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected submit(): void {
    if (this.form.invalid || this.rows.length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.save.emit({
      name: value.name.trim(),
      sourceProgramId: this.sourceProgramId,
      exercises: value.exercises.map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets,
        reps: e.reps.trim(),
        restSeconds: e.restSeconds,
        ...(e.targetWeightKg !== null ? { targetWeightKg: e.targetWeightKg } : {}),
      })),
    });
  }

  private replaceRows(exercises: readonly RoutineExercise[], name: string): void {
    this.rows.clear();
    exercises.forEach((e) => this.addRow(e));
    if (!this.form.controls.name.value) this.form.controls.name.setValue(name);
  }

  private addRow(e: RoutineExercise): void {
    this.rows.push(
      this.fb.group({
        exerciseId: this.fb.control(e.exerciseId),
        sets: this.fb.control(e.sets, [
          Validators.required,
          Validators.min(1),
          Validators.max(MAX_SETS),
        ]),
        reps: this.fb.control(e.reps, [Validators.required, Validators.maxLength(20)]),
        restSeconds: this.fb.control(e.restSeconds, [
          Validators.required,
          Validators.min(0),
          Validators.max(MAX_REST_SECONDS),
        ]),
        targetWeightKg: new FormControl<number | null>(e.targetWeightKg ?? null, [
          Validators.min(0),
          Validators.max(MAX_WEIGHT_KG),
        ]),
      }) as ExerciseRow,
    );
    this.syncSelected();
  }

  private syncSelected(): void {
    this.selectedIds.set(this.rows.controls.map((r) => r.controls.exerciseId.value));
  }
}
