import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkoutPlanner } from '../../planner/workout-planner';

@Component({
  selector: 'app-workouts-page',
  imports: [WorkoutPlanner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <p class="eyebrow">Workout log</p>
      <h1>Plan, log and review</h1>
      <p class="text-muted">
        Record weights and reps for every set. Your coach can see your completed sessions.
      </p>
    </header>
    <app-workout-planner />
  `,
  styleUrl: './dashboard-pages.scss',
})
export class WorkoutsPage {}
