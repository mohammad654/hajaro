import { Injectable, computed } from '@angular/core';
import { SERVICES } from '../data/services.data';
import { CoachingService } from '../models';
import { EntityStore } from './entity-store';

@Injectable({ providedIn: 'root' })
export class ServiceCatalogStore extends EntityStore<CoachingService> {
  readonly featured = computed(() => this.all().filter((s) => s.featured));

  constructor() {
    super('services', SERVICES);
  }

  bySlug(slug: string): CoachingService | undefined {
    return this.all().find((s) => s.slug === slug);
  }
}
