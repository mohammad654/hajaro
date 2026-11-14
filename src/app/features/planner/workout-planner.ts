import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ExerciseStore } from '../../core/data-access/exercise.store';
import { MuscleStore } from '../../core/data-access/muscle.store';
import { ProgramStore } from '../../core/data-access/program.store';
import { RoutineStore, SessionStore } from '../../core/data-access/portal.stores';
import { FULL_BODY_WORKOUT_CHART } from '../../core/data/programs.data';
import { MuscleId, WorkoutRoutine, WorkoutSession } from '../../core/models';
import { BrowserStorage } from '../../core/services/browser-storage.service';
import { ClientReady } from '../../core/services/client-ready';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from '../../shared/ui/icon/icon';
import { CHART_TEMPLATE_ID, RoutineBuilder, RoutineDraft } from './routine-builder';
import { SessionHistory } from './session-history';
import { SessionTracker } from './session-tracker';
import {
  activeSessionKey,
  createRoutine,
  exercisesFromChart,
  exercisesFromDay,
  routineExerciseFrom,
  startSession,
} from './planner.utils';
import { LocalePathPipe } from '../../core/i18n/current-locale';

type PlannerTab = 'routines' | 'builder' | 'session' | 'history';
const GUEST_OWNER = 'guest';

/**
 * Workout planner: build routines, log sessions and review history.
 * Used on the public /workout-planner page and inside the client dashboard.
 */
@Component({
  selector: 'app-workout-planner',
  imports: [
    LocalePathPipe,
    DatePipe,
    RouterLink,
    Icon,
    RoutineBuilder,
    SessionTracker,
    SessionHistory,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workout-planner.html',
  styleUrl: './workout-planner.scss',
})
export class WorkoutPlanner {
  private readonly auth = inject(AuthService);
  private readonly routines = inject(RoutineStore);
  private readonly sessions = inject(SessionStore);
  private readonly programs = inject(ProgramStore);
  private readonly exercises = inject(ExerciseStore);
  private readonly muscles = inject(MuscleStore);
  private readonly storage = inject(BrowserStorage);
  private readonly toast = inject(ToastService);
  private readonly ready = inject(ClientReady).ready;

  /** Optional deep-link intents (from programs, exercises, the muscle chart). */
  readonly programId = input<string | undefined>(undefined);
  readonly addExerciseId = input<string | undefined>(undefined);
  readonly muscleId = input<string | undefined>(undefined);
  readonly template = input<string | undefined>(undefined);

  protected readonly tabs: readonly { id: PlannerTab; label: string }[] = [
    { id: 'routines', label: $localize`My routines` },
    { id: 'builder', label: $localize`Build` },
    { id: 'session', label: $localize`Log workout` },
    { id: 'history', label: $localize`History` },
  ];

  protected readonly tab = signal<PlannerTab>('routines');
  protected readonly editing = signal<WorkoutRoutine | null>(null);
  protected readonly draft = signal<RoutineDraft | null>(null);
  protected readonly draftMuscle = signal<MuscleId | null>(null);
  /** Incremented to remount the builder with fresh initial values. */
  protected readonly builderKey = signal(0);
  protected readonly activeSession = signal<WorkoutSession | null>(null);
  protected readonly saving = signal(false);

  protected readonly ownerId = computed(() => this.auth.user()?.id ?? GUEST_OWNER);
  protected readonly isGuest = computed(() => this.ready() && !this.auth.user());
  protected readonly myRoutines = computed(() => this.routines.forOwner(this.ownerId()));
  protected readonly mySessions = computed(() => this.sessions.forOwner(this.ownerId()));

  private get activeKey(): string {
    return activeSessionKey(this.ownerId());
  }

  constructor() {
    // An unfinished workout survives page refreshes (browser only, after hydration).
    afterNextRender(() => {
      const saved = this.storage.read<WorkoutSession>(this.activeKey);
      if (saved) this.activeSession.set(saved);
      this.applyDeepLink();
    });
  }

  protected selectTab(tab: PlannerTab): void {
    if (tab === 'builder') {
      this.newRoutine();
      return;
    }
    this.tab.set(tab);
  }

  protected newRoutine(draft: RoutineDraft | null = null, muscle: MuscleId | null = null): void {
    this.editing.set(null);
    this.draft.set(draft);
    this.draftMuscle.set(muscle);
    this.openBuilder();
  }

  protected edit(routine: WorkoutRoutine): void {
    this.editing.set(routine);
    this.draft.set(null);
    this.openBuilder();
  }

  protected saveRoutine(draft: RoutineDraft): void {
    const existing = this.editing();
    const routine: WorkoutRoutine = existing
      ? { ...existing, ...draft, updatedAt: new Date().toISOString() }
      : createRoutine(this.ownerId(), draft.name, draft.exercises, draft.sourceProgramId);
    this.saving.set(true);
    this.routines
      .save(routine, !existing)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success($localize`“${routine.name}:NAME:” saved.`);
          this.tab.set('routines');
        },
        error: (e: Error) => this.toast.error(e.message),
      });
  }

  protected duplicate(routine: WorkoutRoutine): void {
    const copy = createRoutine(
      this.ownerId(),
      $localize`${routine.name}:NAME: (copy)`,
      routine.exercises,
      routine.sourceProgramId,
    );
    this.routines
      .save(copy, true)
      .subscribe(() => this.toast.success($localize`Routine duplicated.`));
  }

  protected deleteRoutine(routine: WorkoutRoutine): void {
    this.routines
      .remove(routine.id)
      .subscribe(() => this.toast.info($localize`“${routine.name}:NAME:” deleted.`));
  }

  protected start(routine: WorkoutRoutine): void {
    if (this.activeSession() && !this.confirmReplace()) return;
    this.updateSession(startSession(this.ownerId(), routine));
    this.tab.set('session');
  }

  protected updateSession(session: WorkoutSession | null): void {
    this.activeSession.set(session);
    if (session) this.storage.write(this.activeKey, session);
    else this.storage.remove(this.activeKey);
  }

  protected finish(session: WorkoutSession): void {
    this.saving.set(true);
    this.sessions
      .save(session, true)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.updateSession(null);
          this.toast.success($localize`Workout saved. Nice work.`);
          this.tab.set('history');
        },
        error: (e: Error) => this.toast.error(e.message),
      });
  }

  protected discard(): void {
    this.updateSession(null);
    this.toast.info($localize`Workout discarded.`);
    this.tab.set('routines');
  }

  protected deleteSession(id: string): void {
    this.sessions.remove(id).subscribe(() => this.toast.info($localize`Workout deleted.`));
  }

  protected setCount(routine: WorkoutRoutine): number {
    return routine.exercises.reduce((sum, e) => sum + e.sets, 0);
  }

  private openBuilder(): void {
    this.builderKey.update((k) => k + 1);
    this.tab.set('builder');
  }

  private confirmReplace(): boolean {
    this.toast.info($localize`Finish or discard your current workout before starting another one.`);
    this.tab.set('session');
    return false;
  }

  private applyDeepLink(): void {
    const program = this.programs.get(this.programId());
    if (program) {
      const day = program.schedule.find((d) => !d.isRestDay);
      if (day) {
        this.newRoutine({
          name: `${program.name}: ${day.focus}`,
          exercises: exercisesFromDay(day),
          sourceProgramId: program.id,
        });
      }
      return;
    }
    if (this.template() === CHART_TEMPLATE_ID) {
      this.newRoutine({
        name: $localize`Full body workout`,
        exercises: exercisesFromChart(FULL_BODY_WORKOUT_CHART),
      });
      return;
    }
    const exercise = this.exercises.get(this.addExerciseId());
    if (exercise) {
      this.newRoutine({
        name: '',
        exercises: [
          routineExerciseFrom(exercise.id, 3, exercise.recommendedReps, exercise.restSeconds || 90),
        ],
      });
      return;
    }
    const muscle = this.muscleId();
    if (this.muscles.isMuscleId(muscle)) this.newRoutine(null, muscle);
  }
}
