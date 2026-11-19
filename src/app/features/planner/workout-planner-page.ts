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
      i18n-eyebrow
      eyebrow="Free training tool"
      i18n-title
      title="Workout planner"
      i18n-lead
      lead="Build routines from any program or muscle group, set your own sets, reps and rest, then log weights and reps as you train and look back at every workout."
      [breadcrumbs]="breadcrumbs"
      imageSrc="images/home/markusspiske-fitness-594143_1920.jpg"
      [imageBackground]="true"
      imagePosition="center 55%"
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
  protected readonly breadcrumbs = [{ label: $localize`Workout planner`, url: '/workout-planner' }];
  /** Query parameters bound by the router. */
  readonly program = input<string | undefined>(undefined);
  readonly add = input<string | undefined>(undefined);
  readonly muscle = input<string | undefined>(undefined);
  readonly template = input<string | undefined>(undefined);

  constructor() {
    applyPageSeo('workout-planner', {
      title: $localize`Free Workout Planner & Training Log`,
      description: $localize`Plan and track your training: build routines, set sets, reps and rest, log weights and reps and look back at your workout history.`,
    });
  }
}
