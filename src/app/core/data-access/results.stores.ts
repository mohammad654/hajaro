import { Injectable, computed } from '@angular/core';
import { TESTIMONIALS_SEED, TRANSFORMATIONS_SEED } from '../data/portal-demo.data';
import { Testimonial, Transformation } from '../models';
import { EntityStore } from './entity-store';

@Injectable({ providedIn: 'root' })
export class TransformationStore extends EntityStore<Transformation> {
  /** Only consented, published stories are ever shown publicly. */
  readonly public = computed(() => this.all().filter((t) => t.published && t.consentConfirmed));

  constructor() {
    super('transformations', TRANSFORMATIONS_SEED);
  }
}

@Injectable({ providedIn: 'root' })
export class TestimonialStore extends EntityStore<Testimonial> {
  readonly public = computed(() => this.all().filter((t) => t.published && t.consentConfirmed));

  constructor() {
    super('testimonials', TESTIMONIALS_SEED);
  }
}
