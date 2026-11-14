import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseStore } from '../../core/data-access/exercise.store';
import { MuscleId, WorkoutChartRow } from '../../core/models';
import { LocalePathPipe } from '../../core/i18n/current-locale';

/** The Full Body Muscle Workout Chart: one row per muscle/exercise with example sets and reps. */
@Component({
  selector: 'app-workout-chart-table',
  imports: [LocalePathPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-wrap">
      <table class="table chart">
        <caption class="visually-hidden" i18n>
          Full body workout chart
        </caption>
        <thead>
          <tr>
            <th scope="col" i18n>Muscle group</th>
            <th scope="col" i18n>Exercise</th>
            <th scope="col" class="num" i18n>Sets</th>
            <th scope="col" class="num" i18n>Reps</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.exerciseId) {
            <tr [class.is-selected]="row.muscleId === selected()">
              <th scope="row">
                <button
                  type="button"
                  class="muscle-btn"
                  (click)="muscleSelect.emit(row.muscleId)"
                  i18n-aria-label
                  aria-label="Show {{ row.muscleGroup }} on the anatomy chart"
                >
                  <span class="swatch" aria-hidden="true"></span>{{ row.muscleGroup }}
                </button>
              </th>
              <td>
                @if (row.exercise; as exercise) {
                  <a [routerLink]="['/exercises', exercise.slug] | localePath">{{
                    exercise.name
                  }}</a>
                }
              </td>
              <td class="num">{{ row.sets }}</td>
              <td class="num">{{ row.reps }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .chart th[scope='row'] {
      background: none;
      font-size: var(--fs-sm);
      letter-spacing: 0;
      text-transform: none;
      color: var(--c-text);
    }
    .muscle-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--sp-2);
      border: 0;
      background: none;
      padding: var(--sp-1) 0;
      font-weight: 600;
      color: inherit;
    }
    .muscle-btn:hover {
      color: var(--c-accent);
    }
    .swatch {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      background: var(--muscle-base);
      border: 1px solid var(--c-border-strong);
    }
    tr.is-selected {
      background: var(--c-accent-soft) !important;
    }
    tr.is-selected .swatch {
      background: var(--c-accent);
      border-color: var(--c-accent);
    }
    td a {
      color: var(--c-text);
      text-decoration: none;
    }
    td a:hover {
      color: var(--c-accent);
    }
  `,
})
export class WorkoutChartTable {
  private readonly exercises = inject(ExerciseStore);

  readonly chart = input.required<readonly WorkoutChartRow[]>();
  readonly selected = input<MuscleId | null>(null);
  readonly muscleSelect = output<MuscleId>();

  protected readonly rows = computed(() =>
    this.chart().map((row) => ({ ...row, exercise: this.exercises.get(row.exerciseId) })),
  );
}
