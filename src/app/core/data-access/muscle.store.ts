import { Injectable } from '@angular/core';
import { MUSCLES } from '../data/muscles.data';
import { MuscleGroup, MuscleId } from '../models';

/** Muscle reference data is static educational content (not editable). */
@Injectable({ providedIn: 'root' })
export class MuscleStore {
  readonly all: readonly MuscleGroup[] = MUSCLES;
  private readonly index = new Map(MUSCLES.map((m) => [m.id, m]));

  get(id: string | null | undefined): MuscleGroup | undefined {
    return id ? this.index.get(id as MuscleId) : undefined;
  }

  isMuscleId(value: string | null | undefined): value is MuscleId {
    return !!value && this.index.has(value as MuscleId);
  }
}
