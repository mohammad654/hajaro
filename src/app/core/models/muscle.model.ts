import { Entity } from './common.model';

export type MuscleId =
  | 'chest'
  | 'front-delts'
  | 'side-delts'
  | 'rear-delts'
  | 'traps'
  | 'lats'
  | 'rhomboids'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'rectus-abdominis'
  | 'obliques'
  | 'transverse-abdominis'
  | 'erector-spinae'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'glute-medius'
  | 'calves'
  | 'soleus'
  | 'hip-adductors'
  | 'hip-abductors';

export type MuscleRegion = 'upper-body' | 'core' | 'lower-body';

export type AnatomyView = 'front' | 'back';

export const MUSCLE_REGION_LABELS: Readonly<Record<MuscleRegion, string>> = {
  'upper-body': $localize`Upper body`,
  core: $localize`Core`,
  'lower-body': $localize`Lower body`,
};

export interface MuscleGroup extends Entity {
  readonly id: MuscleId;
  readonly name: string;
  /** Anatomical / scientific name. */
  readonly anatomicalName: string;
  readonly region: MuscleRegion;
  /** Views on which this muscle is visible on the anatomy chart. */
  readonly views: readonly AnatomyView[];
  /** Deep muscles cannot be seen at the surface; the chart outlines them instead. */
  readonly deep?: boolean;
  readonly summary: string;
  readonly functions: readonly string[];
  readonly recommendedSets: string;
  readonly recommendedReps: string;
  readonly frequency: string;
  readonly techniqueTips: readonly string[];
  readonly commonMistakes: readonly string[];
}

/** One drawable region of the anatomy illustration. Paths are drawn for the figure's right side and mirrored. */
export interface AnatomyShape {
  readonly muscle: MuscleId;
  readonly paths: readonly string[];
}

export interface AnatomyFigure {
  readonly view: AnatomyView;
  readonly muscles: readonly AnatomyShape[];
  readonly deepMuscles: readonly AnatomyShape[];
  readonly filler: readonly string[];
  readonly detailLines: readonly string[];
}
