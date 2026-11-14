import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectNotFoundStatus } from '../../core/seo/http-status';
import { SeoService } from '../../core/seo/seo.service';
import { NotFoundContent } from './not-found-content';

@Component({
  selector: 'app-not-found-page',
  imports: [NotFoundContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-not-found-content
    what="page"
    backLink="/programs"
    backLabel="Explore programs"
  />`,
})
export class NotFoundPage {
  constructor() {
    injectNotFoundStatus()();
    inject(SeoService).update({
      title: 'Page not found',
      description: 'The page you are looking for could not be found.',
      noindex: true,
    });
  }
}
