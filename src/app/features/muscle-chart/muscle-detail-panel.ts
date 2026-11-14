import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseStore } from '../../core/data-access/exercise.store';
import { EQUIPMENT_LABELS, Equipment, MUSCLE_REGION_LABELS, MuscleGroup } from '../../core/models';
import { ExerciseCard } from '../../shared/cards/exercise-card';

const MAX_PRIMARY_SHOWN = 6;
const MAX_SECONDARY_SHOWN = 6;

/** Everything a lifter needs to know about one muscle: function, programming and the best exercises. */
@Component({
  selector: 'app-muscle-detail-panel',
  imports: [RouterLink, ExerciseCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './muscle-detail-panel.html',
  styleUrl: './muscle-detail-panel.scss',
})
export class MuscleDetailPanel {
  private readonly exercises = inject(ExerciseStore);

  readonly muscle = input.required<MuscleGroup>();

  protected readonly regionLabels = MUSCLE_REGION_LABELS;
  protected readonly grouped = computed(() => this.exercises.forMuscle(this.muscle().id));
  protected readonly primary = computed(() => this.grouped().primary.slice(0, MAX_PRIMARY_SHOWN));
  protected readonly secondary = computed(() =>
    this.grouped().secondary.slice(0, MAX_SECONDARY_SHOWN),
  );
  protected readonly totalCount = computed(
    () => this.grouped().primary.length + this.grouped().secondary.length,
  );

  /** Equipment needed for the primary exercises. */
  protected readonly equipment = computed(() => {
    const set = new Set<Equipment>(this.grouped().primary.flatMap((e) => e.equipment));
    return [...set].map((e) => EQUIPMENT_LABELS[e]);
  });
}
