import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TestimonialStore, TransformationStore } from '../../core/data-access/results.stores';
import { applyPageSeo } from '../../core/seo/page-seo';
import { CtaSection } from '../../shared/ui/cta-section';
import { MediaFrame } from '../../shared/ui/media-frame';
import { PageHero } from '../../shared/ui/page-hero';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-transformations-page',
  imports: [LocalePathPipe, RouterLink, DatePipe, PageHero, MediaFrame, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transformations-page.html',
  styleUrl: './transformations-page.scss',
})
export class TransformationsPage {
  protected readonly transformations = inject(TransformationStore);
  protected readonly testimonials = inject(TestimonialStore);

  protected readonly breadcrumbs = [{ label: $localize`Results`, url: '/transformations' }];
  protected readonly principles = [
    {
      title: $localize`Written permission, every time`,
      text: $localize`Photos and stories only go online with the client's written permission, and come down quickly when they ask.`,
    },
    {
      title: $localize`Not edited`,
      text: $localize`Photos are not retouched to make results look bigger. Light, pose and timing are kept as similar as possible.`,
    },
    {
      title: $localize`With context`,
      text: $localize`Each story shows the goal, how long it took and what the client did, because results depend on the person.`,
    },
    {
      title: $localize`Private unless chosen otherwise`,
      text: $localize`Clients decide whether their face is shown and which name is used. Progress photos stay private unless they say otherwise.`,
    },
  ];

  constructor() {
    applyPageSeo('transformations', {
      title: $localize`Client Results & Progress`,
      description: $localize`Real progress from real clients, shared with permission. Results vary per person, depending on training, food and consistency.`,
    });
  }
}
