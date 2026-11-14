import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ExerciseStore } from '../../core/data-access/exercise.store';
import { WorkoutSession } from '../../core/models';
import { Icon } from '../../shared/ui/icon/icon';
import { sessionStats } from './planner.utils';

/** Previous workout sessions with completion, volume and set-by-set detail. */
@Component({
  selector: 'app-session-history',
  imports: [DatePipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (rows().length) {
      <ul class="history">
        @for (row of rows(); track row.session.id) {
          <li class="card">
            <details>
              <summary>
                <div>
                  <strong>{{ row.session.name }}</strong>
                  <span class="text-small text-muted">
                    <time [attr.datetime]="row.session.startedAt">{{
                      row.session.startedAt | date: 'EEE d MMM y, HH:mm'
                    }}</time>
                  </span>
                </div>
                <div class="history__stats">
                  <span class="badge" [class.badge--success]="row.stats.percent === 100"
                    >{{ row.stats.percent }}%</span
                  >
                  <span class="text-small"
                    >{{ row.stats.completedSets }}/{{ row.stats.totalSets }} sets</span
                  >
                  <span class="text-small">{{ row.stats.volumeKg }} kg</span>
                </div>
              </summary>
              <div class="history__detail">
                @for (ex of row.session.exercises; track $index) {
                  <div class="history__exercise">
                    <strong>{{ exerciseName(ex.exerciseId) }}</strong>
                    <span>
                      @for (set of ex.sets; track $index; let last = $last) {
                        <span [class.is-missed]="!set.completed"
                          >{{ set.weightKg ?? 0 }}kg × {{ set.reps ?? 0 }}</span
                        >
                        @if (!last) {
                          ,
                        }
                      }
                    </span>
                  </div>
                }
                @if (row.session.notes) {
                  <p class="text-small text-muted">“{{ row.session.notes }}”</p>
                }
                @if (allowDelete()) {
                  <button
                    type="button"
                    class="btn btn--danger btn--sm"
                    (click)="deleted.emit(row.session.id)"
                  >
                    <app-icon name="trash" [size]="16" /> Delete session
                  </button>
                }
              </div>
            </details>
          </li>
        }
      </ul>
    } @else {
      <p class="placeholder-note">
        No completed workouts yet. Finish a session and it will appear here.
      </p>
    }
  `,
  styles: `
    .history {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: var(--sp-3);
    }
    .card {
      padding: 0;
    }
    summary {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-3);
      padding: var(--sp-4) var(--sp-5);
      cursor: pointer;
      list-style: none;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary > div:first-child {
      display: grid;
    }
    .history__stats {
      display: flex;
      align-items: center;
      gap: var(--sp-3);
      color: var(--c-text-muted);
    }
    .history__detail {
      display: grid;
      gap: var(--sp-3);
      padding: 0 var(--sp-5) var(--sp-5);
      border-top: 1px solid var(--c-border);
      padding-top: var(--sp-4);
    }
    .history__exercise {
      display: grid;
      font-size: var(--fs-sm);
    }
    .history__exercise > span {
      color: var(--c-text-muted);
    }
    .is-missed {
      text-decoration: line-through;
      opacity: 0.6;
    }
    .btn {
      justify-self: start;
    }
  `,
})
export class SessionHistory {
  private readonly exercises = inject(ExerciseStore);

  readonly sessions = input.required<readonly WorkoutSession[]>();
  readonly allowDelete = input(true);
  readonly deleted = output<string>();

  protected readonly rows = computed(() =>
    this.sessions()
      .filter((s) => s.completedAt)
      .map((session) => ({ session, stats: sessionStats(session) })),
  );

  protected exerciseName(id: string): string {
    return this.exercises.get(id)?.name ?? id;
  }
}
