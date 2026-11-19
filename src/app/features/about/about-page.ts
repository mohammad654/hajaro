import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteContentStore } from '../../core/data-access/site-content.store';
import { CredentialItem } from '../../core/models';
import { applyPageSeo } from '../../core/seo/page-seo';
import { CtaSection } from '../../shared/ui/cta-section';
import { Icon } from '../../shared/ui/icon/icon';
import { MediaFrame } from '../../shared/ui/media-frame';
import { PageHero } from '../../shared/ui/page-hero';
import { LocalePathPipe } from '../../core/i18n/current-locale';

/** Temporary stock photo, also on the homepage, shown only until a real trainer photo is set. */
const DEMO_TRAINER_PHOTO = {
  src: 'images/home/luissantos2020-fitness-5991125_1920.jpg',
  alt: $localize`Muscular man leaning forward and gripping a bar, in black and white`,
  position: '45% center',
};

/** Bracketed text marks copy the trainer still needs to replace. */
const isPlaceholder = (text: string) => text.trim().startsWith('[');

@Component({
  selector: 'app-about-page',
  imports: [LocalePathPipe, RouterLink, PageHero, MediaFrame, CtaSection, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  protected readonly content = inject(SiteContentStore).content;

  protected readonly photo = computed(() => {
    const c = this.content();
    return c.trainerPhotoUrl
      ? { src: c.trainerPhotoUrl, alt: c.trainerPhotoAlt ?? '', position: 'center' }
      : DEMO_TRAINER_PHOTO;
  });

  protected readonly bio = computed(() =>
    this.content().trainerBio.filter((p) => !isPlaceholder(p)),
  );
  protected readonly journey = computed(() =>
    this.content().trainerJourney.filter((p) => !isPlaceholder(p)),
  );
  /** Only verified credentials are shown; groups without any are left out. */
  protected readonly credentialGroups = computed(() => {
    const c = this.content();
    return [
      { title: $localize`Qualifications and certificates`, items: verified(c.qualifications) },
      { title: $localize`Competitions`, items: verified(c.competitionHistory) },
      { title: $localize`Achievements`, items: verified(c.achievements) },
    ].filter((group) => group.items.length > 0);
  });

  /** One icon per method step: assess, plan, train, adjust. */
  protected readonly methodIcons = ['search', 'clipboard', 'dumbbell', 'refresh'];

  protected readonly breadcrumbs = [{ label: $localize`About`, url: '/about' }];

  protected readonly reasons = [
    {
      title: $localize`A plan written for you`,
      text: $localize`Your plan fits your body, your schedule, your equipment and your goal. Nothing is copied from someone else.`,
    },
    {
      title: $localize`Based on evidence`,
      text: $localize`I base training and food advice on current research, and on what I see working with real people.`,
    },
    {
      title: $localize`Someone who checks in`,
      text: $localize`A weekly check-in and direct contact help you keep going when motivation drops.`,
    },
    {
      title: $localize`Honest, health first`,
      text: $localize`No crash diets and no promises I can't keep. Progress you can hold on to.`,
    },
  ];

  constructor() {
    applyPageSeo('about', {
      title: $localize`About the Coach`,
      description: $localize`Meet the bodybuilder and personal trainer behind Hajaro Coaching: how I train, what I believe in and who I work best with.`,
      type: 'profile',
    });
  }
}

function verified(items: readonly CredentialItem[]): CredentialItem[] {
  return items.filter((item) => item.verified);
}
