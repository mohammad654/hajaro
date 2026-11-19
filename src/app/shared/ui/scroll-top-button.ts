import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { Icon } from './icon/icon';

/** Scroll distance in pixels after which the button appears. */
const SHOW_AFTER = 300;

/**
 * Floating "Back to top" button, stacked above the WhatsApp button. Hidden at the top of the page
 * and while the mobile menu is open; it appears once the visitor scrolls down.
 */
@Component({
  selector: 'app-scroll-top-button',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="to-top"
      [class.is-visible]="visible()"
      i18n-aria-label
      aria-label="Back to top"
      (click)="scrollToTop()"
    >
      <app-icon name="arrow-up" [size]="20" />
    </button>
  `,
  styles: `
    @use 'mixins' as *;

    .to-top {
      position: fixed;
      /* Centred above the 3.5rem WhatsApp circle on phones. */
      right: calc(var(--sp-4) + (3.5rem - var(--tap)) / 2 + env(safe-area-inset-right, 0px));
      bottom: calc(var(--sp-4) + 3.5rem + var(--sp-3) + env(safe-area-inset-bottom, 0px));
      z-index: 90;
      display: grid;
      place-items: center;
      width: var(--tap);
      height: var(--tap);
      border: 1px solid var(--c-border-strong);
      border-radius: var(--radius-round);
      background: var(--c-surface-2);
      color: var(--c-text);
      box-shadow: var(--shadow);
      /* Hidden: invisible, out of the tab order, slightly lowered. */
      opacity: 0;
      visibility: hidden;
      transform: translateY(var(--sp-2));
      transition:
        opacity var(--dur) var(--ease),
        transform var(--dur) var(--ease),
        border-color var(--dur-fast) var(--ease),
        color var(--dur-fast) var(--ease),
        visibility 0s linear var(--dur);
    }
    .to-top.is-visible {
      opacity: 1;
      visibility: visible;
      transform: none;
      transition:
        opacity var(--dur) var(--ease),
        transform var(--dur) var(--ease),
        border-color var(--dur-fast) var(--ease),
        color var(--dur-fast) var(--ease),
        visibility 0s;
    }
    .to-top:hover {
      border-color: var(--c-accent);
      color: var(--c-accent);
    }
    .to-top.is-visible:active {
      transform: translateY(1px);
    }
    /* From the tablet breakpoint the WhatsApp button is a wider pill; line up the right edges. */
    @include up($bp-md) {
      .to-top {
        right: calc(var(--sp-4) + env(safe-area-inset-right, 0px));
      }
    }
    :host-context(body.is-scroll-locked) .to-top {
      display: none;
    }
    @media print {
      .to-top {
        display: none;
      }
    }
  `,
})
export class ScrollTopButton {
  private readonly document = inject(DOCUMENT);
  protected readonly visible = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const win = this.document.defaultView;
      if (!win) return;
      const onScroll = () => this.visible.set(win.scrollY > SHOW_AFTER);
      onScroll();
      win.addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => win.removeEventListener('scroll', onScroll));
    });
  }

  /**
   * Scrolls to the top (smooth unless the visitor prefers reduced motion, see the global
   * `scroll-behavior` rule) and moves focus to the main content so keyboard users land there too.
   */
  protected scrollToTop(): void {
    this.document.defaultView?.scrollTo({ top: 0 });
    this.document.getElementById('main')?.focus({ preventScroll: true });
  }
}
