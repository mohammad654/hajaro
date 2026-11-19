import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgramStore } from '../../core/data-access/program.store';
import { DIFFICULTY_LABELS } from '../../core/models';
import { LocalePathPipe } from '../../core/i18n/current-locale';

/** Program slugs representing the classic workout splits, in teaching order. */
const SPLIT_SLUGS = [
  'full-body-3-day',
  'full-body-4-day',
  'push-pull-legs',
  'upper-lower-split',
  'bro-split',
  'strength-and-conditioning',
  'intermediate-hypertrophy',
  'beginner-muscle-building',
  'advanced-bodybuilding',
];

@Component({
  selector: 'app-split-programs',
  imports: [LocalePathPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-wrap">
      <table class="table">
        <caption class="visually-hidden" i18n>
          Workout splits
        </caption>
        <thead>
          <tr>
            <th scope="col" i18n>Split</th>
            <th scope="col" i18n>Weekly schedule</th>
            <th scope="col" class="num" i18n>Days</th>
            <th scope="col" i18n>Level</th>
          </tr>
        </thead>
        <tbody>
          @for (p of splits(); track p.id) {
            <tr>
              <th scope="row">
                <a [routerLink]="['/programs', p.slug] | localePath">{{ p.name }}</a>
              </th>
              <td>
                <ol class="mini-week" i18n-aria-label aria-label="{{ p.name }}: weekly schedule">
                  @for (d of p.schedule; track d.id) {
                    <li
                      [class.is-rest]="d.isRestDay"
                      [title]="d.label + ': ' + (d.isRestDay ? restLabel : d.focus)"
                    >
                      <span class="visually-hidden">{{ d.label }}: </span
                      >{{ d.isRestDay ? restLabel : shortFocus(d.focus) }}
                    </li>
                  }
                </ol>
              </td>
              <td class="num">{{ p.daysPerWeek }}</td>
              <td>{{ levels[p.level] }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    th[scope='row'] {
      background: none;
      text-transform: none;
      letter-spacing: 0;
      font-size: var(--fs-sm);
      white-space: normal;
    }
    th a {
      color: var(--c-text);
      text-decoration: none;
      font-weight: 600;
    }
    th a:hover {
      color: var(--c-accent);
    }
    .mini-week {
      display: grid;
      grid-template-columns: repeat(7, minmax(56px, 1fr));
      gap: 4px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .mini-week li {
      padding: 4px 6px;
      border-radius: var(--radius-sm);
      background: var(--c-accent-soft);
      color: var(--c-accent);
      font-size: var(--fs-2xs);
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mini-week li.is-rest {
      background: var(--c-surface-3);
      color: var(--c-text-subtle);
      font-weight: 400;
    }
  `,
})
export class SplitPrograms {
  private readonly programs = inject(ProgramStore);
  protected readonly levels = DIFFICULTY_LABELS;
  protected readonly restLabel = $localize`Rest`;

  protected readonly splits = computed(() =>
    SPLIT_SLUGS.map((slug) => this.programs.bySlug(slug)).filter((p) => p !== undefined),
  );

  /** "Push: chest, shoulders, triceps" → "Push" */
  protected shortFocus(focus: string): string {
    return focus.split(/:\s|\s[—+-]\s/)[0];
  }
}
