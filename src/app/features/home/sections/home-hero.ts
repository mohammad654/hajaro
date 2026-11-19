import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteContentStore } from '../../../core/data-access/site-content.store';
import { Icon } from '../../../shared/ui/icon/icon';
import { Typewriter } from '../../../shared/ui/typewriter';
import { HERO_FIRST_PHOTO, HERO_MORE_SLIDES, HERO_PILLARS } from '../home.content';
import { LocalePathPipe } from '../../../core/i18n/current-locale';

const SLIDE_INTERVAL_MS = 6500;
/** Typing always ends within this time, which leaves room to read before the slide changes. */
const TYPING_BUDGET_MS = 3500;
/** Only these pause the slides on hover, so a pointer resting on the hero does not stop them. */
const HOLD_AREAS = '.hero__controls, .hero__cta';

@Component({
  selector: 'app-home-hero',
  imports: [LocalePathPipe, RouterLink, NgOptimizedImage, NgTemplateOutlet, Icon, Typewriter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__grid-bg" aria-hidden="true"></div>
      <div
        #carousel
        id="hero-carousel"
        class="hero__carousel carousel slide carousel-fade"
        [class.is-running]="activeSlide() >= 0"
        [class.is-held]="held()"
      >
        <div class="carousel-inner">
          @for (slide of slides(); track slide.src; let first = $first) {
            @let active = activeSlide() === $index;
            <ng-template #title>
              <span aria-hidden="true">
                <app-typewriter
                  [text]="slide.headline"
                  [speed]="slide.speed"
                  [play]="active"
                  [paused]="held()"
                  (done)="headlineDone.set(true)"
                />
                <span class="highlight">
                  <app-typewriter
                    [text]="slide.highlight"
                    [speed]="slide.speed"
                    [play]="active && headlineDone()"
                    [paused]="held()"
                    (done)="revealed.set(true)"
                  />
                </span>
              </span>
            </ng-template>
            <div
              class="carousel-item"
              [class.active]="first"
              [class.is-revealed]="active && revealed()"
            >
              <div class="hero__photo">
                <img
                  [ngSrc]="slide.src"
                  [alt]="slide.alt"
                  fill
                  [priority]="first"
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  [style.object-position]="slide.position"
                />
              </div>
              <div class="container hero__inner">
                <div class="hero__copy" [class.reveal]="first">
                  <p class="eyebrow">{{ content().heroEyebrow }}</p>
                  @if (first) {
                    <h1
                      id="hero-title"
                      class="hero__title"
                      [attr.aria-label]="slide.headline + ' ' + slide.highlight"
                    >
                      <ng-container [ngTemplateOutlet]="title" />
                    </h1>
                  } @else {
                    <h2
                      class="hero__title"
                      [attr.aria-label]="slide.headline + ' ' + slide.highlight"
                    >
                      <ng-container [ngTemplateOutlet]="title" />
                    </h2>
                  }
                  <p class="hero__lead">{{ slide.text }}</p>
                  @if (first) {
                    <div class="cluster hero__cta">
                      <a class="btn btn--primary btn--lg" [routerLink]="'/contact' | localePath">
                        <span i18n>Book a free intro</span>
                        <app-icon name="arrow-right" [size]="18" />
                      </a>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <div class="container hero__foot">
          <div class="hero__controls">
            <button
              class="hero__arrow"
              type="button"
              data-bs-target="#hero-carousel"
              data-bs-slide="prev"
              aria-label="Previous slide"
              i18n-aria-label
            >
              <app-icon name="arrow-left" [size]="18" />
            </button>
            <div class="carousel-indicators">
              @for (slide of slides(); track slide.src; let first = $first) {
                <button
                  type="button"
                  data-bs-target="#hero-carousel"
                  [attr.data-bs-slide-to]="$index"
                  [class.active]="first"
                  [attr.aria-current]="first ? 'true' : null"
                  aria-label="Go to slide {{ $index + 1 }}"
                  i18n-aria-label
                ></button>
              }
            </div>
            <button
              class="hero__arrow"
              type="button"
              data-bs-target="#hero-carousel"
              data-bs-slide="next"
              aria-label="Next slide"
              i18n-aria-label
            >
              <app-icon name="arrow-right" [size]="18" />
            </button>
          </div>
          <ul class="hero__pillars">
            @for (pillar of pillars; track pillar.label) {
              <li><app-icon [name]="pillar.icon" [size]="18" /> {{ pillar.label }}</li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styleUrl: './home-hero.scss',
})
export class HomeHero {
  private readonly destroyRef = inject(DestroyRef);
  private readonly carouselEl = viewChild.required<ElementRef<HTMLElement>>('carousel');

  protected readonly content = inject(SiteContentStore).content;
  protected readonly pillars = HERO_PILLARS;
  protected readonly activeSlide = signal(-1);
  protected readonly headlineDone = signal(false);
  /** The sentence and button show once typing ends, or as soon as the visitor pauses the slide. */
  protected readonly revealed = signal(false);
  protected readonly held = signal(false);
  protected readonly slides = computed(() => {
    const { heroHeadline, heroHighlight, heroSubheadline } = this.content();
    return [
      {
        ...HERO_FIRST_PHOTO,
        headline: heroHeadline,
        highlight: heroHighlight,
        text: heroSubheadline,
      },
      ...HERO_MORE_SLIDES,
    ].map((slide) => {
      const letters = slide.headline.length + slide.highlight.length;
      return { ...slide, speed: Math.min(50, Math.floor(TYPING_BUDGET_MS / (letters || 1))) };
    });
  });

  constructor() {
    afterNextRender(() => void this.startCarousel());
  }

  private async startCarousel(): Promise<void> {
    const { default: Carousel } = await import('bootstrap/js/src/carousel.js');
    if (this.destroyRef.destroyed) return;

    const root = this.carouselEl().nativeElement;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const canHover = matchMedia('(hover: hover)');
    const listeners = new AbortController();
    const { signal } = listeners;
    let hovered =
      canHover.matches &&
      Array.from(root.querySelectorAll(HOLD_AREAS)).some((area) => area.matches(':hover'));
    let keyboardFocus = false;

    const syncHeld = () => {
      const held = hovered || keyboardFocus;
      this.held.set(held);
      if (held) this.revealed.set(true);
    };

    const carousel = new Carousel(root, {
      interval: SLIDE_INTERVAL_MS,
      ride: true,
      pause: false,
      touch: true,
    });

    // Bootstrap restarts cycling after clicks and swipes, so every restart goes through this check.
    const startCycle = carousel.cycle.bind(carousel);
    carousel.cycle = () => {
      if (!reducedMotion.matches && !keyboardFocus && !hovered) startCycle();
    };

    const setHovered = (value: boolean) => {
      if (value === hovered) return;
      hovered = value;
      syncHeld();
      if (hovered) carousel.pause();
      else carousel.cycle();
    };
    root.addEventListener(
      'mouseover',
      (event) =>
        setHovered(
          canHover.matches &&
            event.target instanceof Element &&
            event.target.closest(HOLD_AREAS) !== null,
        ),
      { signal },
    );
    root.addEventListener('mouseleave', () => setHovered(false), { signal });

    root.addEventListener(
      'slide.bs.carousel',
      (event) => this.playSlide((event as Event & { to: number }).to),
      { signal },
    );
    root.addEventListener(
      'focusin',
      (event) => {
        keyboardFocus = (event.target as HTMLElement).matches(':focus-visible');
        if (!keyboardFocus) return;
        carousel.pause();
        syncHeld();
      },
      { signal },
    );
    root.addEventListener(
      'focusout',
      (event) => {
        if (root.contains(event.relatedTarget as Node | null)) return;
        keyboardFocus = false;
        syncHeld();
        carousel.cycle();
      },
      { signal },
    );
    reducedMotion.addEventListener(
      'change',
      () => (reducedMotion.matches ? carousel.pause() : carousel.cycle()),
      { signal },
    );

    this.playSlide(0);
    carousel.cycle();

    this.destroyRef.onDestroy(() => {
      listeners.abort();
      carousel.pause();
      clearTimeout(carousel.touchTimeout);
      carousel.dispose();
    });
  }

  /**
   * Every new slide types from the start, even with the pointer already on the controls. Otherwise
   * a visitor clicking through would never see a headline. Entering afterwards pauses it.
   */
  private playSlide(index: number): void {
    this.activeSlide.set(index);
    this.headlineDone.set(false);
    this.revealed.set(false);
    this.held.set(false);
  }
}
