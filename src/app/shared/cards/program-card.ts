import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DIFFICULTY_LABELS, PROGRAM_GOAL_LABELS, TrainingProgram } from '../../core/models';
import { Icon } from '../ui/icon/icon';
import { LabelPipe } from '../pipes/format.pipes';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-program-card',
  imports: [LocalePathPipe, RouterLink, Icon, LabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card card--interactive program-card" [class.card--featured]="highlight()">
      <div class="cluster">
        <span class="badge badge--accent">{{ program().level | label: levels }}</span>
        <span class="badge">{{ program().goal | label: goals }}</span>
      </div>
      <h3 class="card__title">
        <a class="card__link" [routerLink]="['/programs', program().slug] | localePath">{{
          program().name
        }}</a>
      </h3>
      <p class="text-muted">{{ program().tagline }}</p>
      <dl class="program-card__meta">
        <div>
          <dt>
            <app-icon name="calendar" [size]="16" /> <ng-container i18n>Frequency</ng-container>
          </dt>
          <dd i18n>{{ program().daysPerWeek }} days / week</dd>
        </div>
        <div>
          <dt><app-icon name="clock" [size]="16" /> <ng-container i18n>Duration</ng-container></dt>
          <dd i18n>{{ program().durationWeeks }} weeks</dd>
        </div>
      </dl>
      <span class="link-arrow" aria-hidden="true" i18n>View program</span>
    </article>
  `,
  styles: `
    .program-card {
      display: flex;
      flex-direction: column;
      gap: var(--sp-3);
      height: 100%;
    }
    .card__title {
      margin: var(--sp-2) 0 0;
    }
    p {
      margin: 0;
      flex: 1;
    }
    .program-card__meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--sp-3);
      margin: var(--sp-2) 0;
      padding-top: var(--sp-4);
      border-top: 1px solid var(--c-border);
    }
    dt {
      display: flex;
      align-items: center;
      gap: var(--sp-1);
      font-size: var(--fs-xs);
      color: var(--c-text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    dd {
      margin: 0;
      font-weight: 600;
    }
    .link-arrow {
      color: var(--c-accent);
    }
  `,
})
export class ProgramCard {
  readonly program = input.required<TrainingProgram>();
  readonly highlight = input(false);
  protected readonly levels = DIFFICULTY_LABELS;
  protected readonly goals = PROGRAM_GOAL_LABELS;
}
