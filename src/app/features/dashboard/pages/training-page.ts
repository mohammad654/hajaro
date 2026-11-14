import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { WorkoutDay } from '../../../core/models';
import { BrowserStorage } from '../../../core/services/browser-storage.service';
import { ToastService } from '../../../core/services/toast.service';
import { Icon } from '../../../shared/ui/icon/icon';
import {
  activeSessionKey,
  createRoutine,
  exercisesFromDay,
  startSession,
} from '../../planner/planner.utils';
import { WorkoutDayTable } from '../../programs/workout-day-table';
import { ClientPortal } from '../client-portal.service';

/** The client's assigned weekly schedule with per-day exercise prescriptions. */
@Component({
  selector: 'app-training-page',
  imports: [RouterLink, Icon, WorkoutDayTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <p class="eyebrow">My training</p>
      <h1>{{ portal.program()?.name ?? 'Training plan' }}</h1>
      @if (portal.profile()?.customSchedule) {
        <p class="text-muted">Your coach has customised this plan for you.</p>
      }
    </header>

    @if (portal.schedule().length) {
      <ol class="week" aria-label="Weekly schedule">
        @for (day of portal.schedule(); track day.id) {
          <li>
            <button
              type="button"
              class="week__btn"
              [class.is-rest]="day.isRestDay"
              [attr.aria-pressed]="selected()?.id === day.id"
              (click)="selectedId.set(day.id)"
            >
              <span class="week__label">{{ day.label }}</span>
              <span class="week__focus">{{ day.isRestDay ? 'Rest' : day.focus }}</span>
              @if (portal.today()?.id === day.id) {
                <span class="badge badge--accent">Today</span>
              }
            </button>
          </li>
        }
      </ol>

      @if (selected(); as day) {
        <section class="card" aria-labelledby="day-title">
          <div class="section-row">
            <h2 id="day-title">
              {{ day.label }} — {{ day.isRestDay ? 'Rest & recovery' : day.focus }}
            </h2>
            @if (!day.isRestDay) {
              <button type="button" class="btn btn--primary" (click)="startDay()">
                <app-icon name="play" [size]="16" /> Start this workout
              </button>
            }
          </div>
          @if (day.isRestDay) {
            <p class="text-muted">
              {{ day.focus }}. Recovery is when adaptation happens — walk, stretch, sleep well and
              hit your nutrition targets.
            </p>
          } @else {
            <app-workout-day-table [day]="day" />
            <p class="text-small text-muted hint">
              Select an exercise for step-by-step instructions, posture cues and common mistakes.
            </p>
          }
        </section>
      }

      @if (portal.program(); as program) {
        <div class="grid grid--2 extras">
          <section class="card card--flat">
            <h2 class="h-sm">Warm-up</h2>
            <ol class="numbered-list text-small">
              @for (w of program.warmUp; track w) {
                <li>{{ w }}</li>
              }
            </ol>
          </section>
          <section class="card card--flat">
            <h2 class="h-sm">Progression</h2>
            <ul class="check-list text-small">
              @for (p of program.progression; track p) {
                <li>{{ p }}</li>
              }
            </ul>
          </section>
        </div>
      }
    } @else {
      <div class="card empty">
        <h2>Your plan is being prepared</h2>
        <p>
          Your coach will assign your program shortly. Meanwhile, explore the
          <a routerLink="/programs">program library</a>.
        </p>
      </div>
    }
  `,
  styleUrl: './dashboard-pages.scss',
  styles: `
    .week {
      list-style: none;
      padding: 0;
      margin: 0 0 var(--sp-5);
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: var(--sp-2);
    }
    .week__btn {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      width: 100%;
      min-height: 92px;
      padding: var(--sp-3);
      border: 1px solid var(--c-border);
      border-radius: var(--radius);
      background: var(--c-surface);
      color: var(--c-text);
      text-align: left;
    }
    .week__btn.is-rest {
      border-style: dashed;
      background: transparent;
    }
    .week__btn[aria-pressed='true'] {
      border-color: var(--c-accent);
      background: var(--c-accent-soft);
    }
    .week__label {
      font-size: var(--fs-xs);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--c-text-subtle);
    }
    .week__focus {
      font-size: var(--fs-sm);
      font-weight: 600;
    }
    .hint {
      margin: var(--sp-3) 0 0;
    }
    .extras {
      margin-top: var(--sp-5);
    }
  `,
})
export class TrainingPage {
  protected readonly portal = inject(ClientPortal);
  private readonly storage = inject(BrowserStorage);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  /** Optional ?day= query parameter. */
  readonly day = input<string | undefined>(undefined);

  protected readonly selectedId = linkedSignal(() => this.day() ?? this.portal.today()?.id ?? null);
  protected readonly selected = computed<WorkoutDay | undefined>(
    () =>
      this.portal.schedule().find((d) => d.id === this.selectedId()) ?? this.portal.schedule()[0],
  );

  protected startDay(): void {
    const day = this.selected();
    const ownerId = this.portal.userId();
    if (!day || day.isRestDay || !ownerId) return;
    const key = activeSessionKey(ownerId);
    if (this.storage.read(key)) {
      this.toast.info('You already have a workout in progress — finish or discard it first.');
    } else {
      const routine = createRoutine(ownerId, `${day.label} — ${day.focus}`, exercisesFromDay(day));
      this.storage.write(key, startSession(ownerId, routine));
    }
    void this.router.navigate(['/dashboard/workouts']);
  }
}
