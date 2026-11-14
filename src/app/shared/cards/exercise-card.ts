import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MuscleStore } from '../../core/data-access/muscle.store';
import { DIFFICULTY_LABELS, EXERCISE_CATEGORY_LABELS, Exercise } from '../../core/models';
import { AnatomyFigure } from '../anatomy/anatomy-figure';
import { LabelPipe } from '../pipes/format.pipes';
import { preferredView } from '../anatomy/anatomy.utils';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-exercise-card',
  imports: [LocalePathPipe, RouterLink, AnatomyFigure, LabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card card--interactive ex-card">
      <div class="ex-card__figure">
        <app-anatomy-figure
          [view]="view()"
          [primary]="exercise().primaryMuscles"
          [secondary]="exercise().secondaryMuscles"
          [label]="'Muscles worked: ' + musclesLabel()"
        />
      </div>
      <div class="ex-card__body">
        <div class="cluster">
          <span class="badge badge--accent">{{ exercise().category | label: categoryLabels }}</span>
          <span class="badge">{{ exercise().difficulty | label: difficultyLabels }}</span>
        </div>
        <h3 class="card__title">
          <a class="card__link" [routerLink]="['/exercises', exercise().slug] | localePath">{{
            exercise().name
          }}</a>
        </h3>
        <p class="text-small text-muted">{{ musclesLabel() }}</p>
        <p class="ex-card__prescription">
          {{ exercise().recommendedSets }} sets · {{ exercise().recommendedReps }} reps
        </p>
      </div>
    </article>
  `,
  styles: `
    .ex-card {
      display: grid;
      grid-template-columns: 88px 1fr;
      gap: var(--sp-4);
      padding: var(--sp-5);
      height: 100%;
    }
    .ex-card__figure {
      background: var(--c-bg-elevated);
      border-radius: var(--radius);
      padding: var(--sp-2);
    }
    .card__title {
      font-size: var(--fs-md);
      margin: var(--sp-3) 0 var(--sp-1);
    }
    p {
      margin: 0;
    }
    .ex-card__prescription {
      margin-top: var(--sp-2);
      font-size: var(--fs-xs);
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--c-accent);
    }
  `,
})
export class ExerciseCard {
  private readonly muscles = inject(MuscleStore);
  readonly exercise = input.required<Exercise>();

  protected readonly categoryLabels = EXERCISE_CATEGORY_LABELS;
  protected readonly difficultyLabels = DIFFICULTY_LABELS;
  protected readonly view = computed(() =>
    preferredView(this.exercise().primaryMuscles, this.muscles),
  );
  protected readonly musclesLabel = computed(() =>
    this.exercise()
      .primaryMuscles.map((id) => this.muscles.get(id)?.name ?? id)
      .join(', '),
  );
}
