import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { applyPageSeo } from '../../core/seo/page-seo';
import { PageHero } from '../../shared/ui/page-hero';
import { WorkoutPlanner } from './workout-planner';

@Component({
  selector: 'app-workout-planner-page',
  imports: [PageHero, WorkoutPlanner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      eyebrow="Free training tool"
      title="Workout planner"
      lead="Build routines from any program or muscle group, customise sets, reps and rest, then log weights and reps as you train and review every previous session."
      [breadcrumbs]="[{ label: 'Workout planner', url: '/workout-planner' }]"
    />
    <section class="section section--tight">
      <div class="container">
        <app-workout-planner
          [programId]="program()"
          [addExerciseId]="add()"
          [muscleId]="muscle()"
          [template]="template()"
        />
      </div>
    </section>
  `,
})
export class WorkoutPlannerPage {
  /** Query parameters bound by the router. */
  readonly program = input<string | undefined>(undefined);
  readonly add = input<string | undefined>(undefined);
  readonly muscle = input<string | undefined>(undefined);
  readonly template = input<string | undefined>(undefined);

  constructor() {
    applyPageSeo('workout-planner', {
      title: 'Free Workout Planner & Training Log',
      description:
        'Plan your workouts and track your training: build routines, customise sets, reps and rest periods, log weights and reps and review your workout history.',
    });
  }
}
