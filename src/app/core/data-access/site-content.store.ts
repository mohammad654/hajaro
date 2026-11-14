import { Injectable, computed } from '@angular/core';
import { SITE_CONTENT } from '../data/site-content.data';
import { SiteContent } from '../models';
import { EntityStore } from './entity-store';

@Injectable({ providedIn: 'root' })
export class SiteContentStore extends EntityStore<SiteContent> {
  readonly content = computed<SiteContent>(() => this.all()[0] ?? SITE_CONTENT[0]);

  constructor() {
    super('site-content', SITE_CONTENT);
  }
}
