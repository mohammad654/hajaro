import { Injectable, computed } from '@angular/core';
import { PROGRAMS } from '../data/programs.data';
import { TrainingProgram } from '../models';
import { EntityStore } from './entity-store';

@Injectable({ providedIn: 'root' })
export class ProgramStore extends EntityStore<TrainingProgram> {
  readonly featured = computed(() => this.all().filter((p) => p.featured));

  constructor() {
    super('programs', PROGRAMS);
  }

  bySlug(slug: string): TrainingProgram | undefined {
    return this.all().find((p) => p.slug === slug);
  }
}
