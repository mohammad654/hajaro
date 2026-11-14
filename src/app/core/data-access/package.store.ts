import { Injectable, computed } from '@angular/core';
import { PACKAGES } from '../data/packages.data';
import { CoachingPackage } from '../models';
import { EntityStore } from './entity-store';

@Injectable({ providedIn: 'root' })
export class PackageStore extends EntityStore<CoachingPackage> {
  /** Active packages in display order — the single source for every price shown on the site. */
  readonly active = computed(() =>
    this.all()
      .filter((p) => p.active)
      .slice()
      .sort((a, b) => a.order - b.order),
  );

  constructor() {
    super('packages', PACKAGES);
  }
}
