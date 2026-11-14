import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseStore } from '../../core/data-access/exercise.store';
import { WorkoutDay } from '../../core/models';
import { RestPipe } from '../../shared/pipes/format.pipes';

/** Read-only table of a workout day's exercises (sets, reps, rest, notes). */
@Component({
  selector: 'app-workout-day-table',
  imports: [RouterLink, RestPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-wrap">
      <table class="table">
        <caption class="visually-hidden">
          {{
            day().label
          }}
          —
          {{
            day().focus
          }}
        </caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Exercise</th>
            <th scope="col" class="num">Sets</th>
            <th scope="col" class="num">Reps</th>
            <th scope="col" class="num">Rest</th>
          </tr>
        </thead>
        <tbody>
          @for (item of day().exercises; track $index; let i = $index) {
            <tr>
              <td class="idx">{{ i + 1 }}</td>
              <td>
                @if (exercises.get(item.exerciseId); as exercise) {
                  <a [routerLink]="['/exercises', exercise.slug]">{{ exercise.name }}</a>
                } @else {
                  {{ item.exerciseId }}
                }
                @if (item.notes) {
                  <span class="note">{{ item.notes }}</span>
                }
              </td>
              <td class="num">{{ item.sets }}</td>
              <td class="num">{{ item.reps }}</td>
              <td class="num">{{ item.restSeconds | rest }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .idx {
      color: var(--c-text-subtle);
      width: 2.5rem;
    }
    td a {
      color: var(--c-text);
      font-weight: 600;
      text-decoration: none;
    }
    td a:hover {
      color: var(--c-accent);
    }
    .note {
      display: block;
      font-size: var(--fs-xs);
      color: var(--c-text-subtle);
    }
  `,
})
export class WorkoutDayTable {
  protected readonly exercises = inject(ExerciseStore);
  readonly day = input.required<WorkoutDay>();
}
