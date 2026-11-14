import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TestimonialStore, TransformationStore } from '../../core/data-access/results.stores';
import { applyPageSeo } from '../../core/seo/page-seo';
import { CtaSection } from '../../shared/ui/cta-section';
import { MediaFrame } from '../../shared/ui/media-frame';
import { PageHero } from '../../shared/ui/page-hero';

@Component({
  selector: 'app-transformations-page',
  imports: [RouterLink, DatePipe, PageHero, MediaFrame, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transformations-page.html',
  styleUrl: './transformations-page.scss',
})
export class TransformationsPage {
  protected readonly transformations = inject(TransformationStore);
  protected readonly testimonials = inject(TestimonialStore);

  protected readonly principles = [
    {
      title: 'Written consent, every time',
      text: 'Photos and stories are published only with the client’s explicit, written permission — and removed promptly on request.',
    },
    {
      title: 'Unedited and honest',
      text: 'Images are not retouched to exaggerate results. Lighting, pose and timing are kept as consistent as possible.',
    },
    {
      title: 'Context included',
      text: 'Each story shows the goal, the timeframe and what the client did — because results depend on individual circumstances.',
    },
    {
      title: 'Privacy by default',
      text: 'Clients choose whether to show their face and how they are named. Progress photos stay private unless the client opts in.',
    },
  ];

  constructor() {
    applyPageSeo('transformations', {
      title: 'Client Transformations & Testimonials',
      description:
        'Real client body transformations and testimonials, published with consent: goals, timeframes, training and the results achieved through coaching.',
    });
  }
}
