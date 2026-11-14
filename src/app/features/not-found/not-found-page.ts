import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectNotFoundStatus } from '../../core/seo/http-status';
import { SeoService } from '../../core/seo/seo.service';
import { NotFoundContent } from './not-found-content';

@Component({
  selector: 'app-not-found-page',
  imports: [NotFoundContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-not-found-content
    backLink="/programs"
    i18n-backLabel
    backLabel="See training programs"
  />`,
})
export class NotFoundPage {
  constructor() {
    injectNotFoundStatus()();
    inject(SeoService).update({
      title: $localize`Page not found`,
      description: $localize`The page you're looking for doesn't exist or has moved.`,
      noindex: true,
    });
  }
}
