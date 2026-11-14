import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteContentStore } from '../../core/data-access/site-content.store';
import { CredentialItem } from '../../core/models';
import { applyPageSeo } from '../../core/seo/page-seo';
import { CtaSection } from '../../shared/ui/cta-section';
import { MediaFrame } from '../../shared/ui/media-frame';
import { PageHero } from '../../shared/ui/page-hero';
import { LocalePathPipe } from '../../core/i18n/current-locale';

/** Bracketed text marks copy the trainer still needs to replace. */
const isPlaceholder = (text: string) => text.trim().startsWith('[');

@Component({
  selector: 'app-about-page',
  imports: [LocalePathPipe, RouterLink, PageHero, MediaFrame, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  protected readonly content = inject(SiteContentStore).content;

  protected readonly bio = computed(() =>
    this.content().trainerBio.filter((p) => !isPlaceholder(p)),
  );
  protected readonly journey = computed(() =>
    this.content().trainerJourney.filter((p) => !isPlaceholder(p)),
  );
  protected readonly qualifications = computed(() => verified(this.content().qualifications));
  protected readonly competitions = computed(() => verified(this.content().competitionHistory));
  protected readonly achievements = computed(() => verified(this.content().achievements));
  protected readonly hasCredentials = computed(
    () =>
      this.qualifications().length + this.competitions().length + this.achievements().length > 0,
  );

  protected readonly reasons = [
    {
      title: 'Individual, never templated',
      text: 'Your plan is written for you — your body, your schedule, your equipment and your goals.',
    },
    {
      title: 'Evidence-based',
      text: 'Training and nutrition decisions are grounded in current research and refined by experience.',
    },
    {
      title: 'Accountability that works',
      text: 'Weekly check-ins and direct communication keep you consistent when motivation dips.',
    },
    {
      title: 'Honest and health-first',
      text: 'No crash diets, no unrealistic promises — sustainable progress you can maintain.',
    },
  ];

  constructor() {
    applyPageSeo('about', {
      title: 'About Your Bodybuilding Coach',
      description:
        'Meet your bodybuilding and personal training coach: background, coaching philosophy, training methodology, qualifications and experience.',
      type: 'profile',
    });
  }
}

function verified(items: readonly CredentialItem[]): CredentialItem[] {
  return items.filter((item) => item.verified);
}
