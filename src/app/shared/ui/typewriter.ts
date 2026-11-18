import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

/**
 * Types its text letter by letter while `play` is true and clears it when `play` turns false.
 * Untyped letters stay in the layout, so the text never reflows. With reduced motion, or without
 * JavaScript, the full text simply shows.
 */
@Component({
  selector: 'app-typewriter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-playing]': 'play()' },
  template: `
    <span>{{ typed() }}</span>
    @if (showCursor()) {
      <span class="cursor"></span>
    }
    <span class="rest">{{ rest() }}</span>
  `,
  styles: `
    .cursor {
      position: relative;
    }
    .cursor::after {
      content: '';
      position: absolute;
      top: 0.08em;
      left: 0.04em;
      width: 0.06em;
      height: 0.78em;
      background: var(--c-accent);
    }
    @media (prefers-reduced-motion: reduce) {
      .cursor {
        display: none;
      }
    }
    @media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
      .cursor::after {
        animation: typewriter-blink 1s steps(1) infinite;
      }
      /* The delayed animation reveals the text if the page script never starts. */
      .rest {
        visibility: hidden;
        animation: typewriter-fallback 0.01s linear 4s forwards;
        animation-play-state: var(--typewriter-fallback, running);
      }
      :host(.is-playing) .rest {
        animation: none;
      }
    }
    @keyframes typewriter-blink {
      50% {
        opacity: 0;
      }
    }
    @keyframes typewriter-fallback {
      to {
        visibility: visible;
      }
    }
  `,
})
export class Typewriter {
  readonly text = input.required<string>();
  /** Milliseconds per letter. */
  readonly speed = input(50);
  readonly play = input(false);
  readonly paused = input(false);
  readonly done = output<void>();

  private readonly count = signal(0);
  private readonly letters = computed(() => Array.from(this.text()));

  protected readonly typed = computed(() => this.letters().slice(0, this.count()).join(''));
  protected readonly rest = computed(() => this.letters().slice(this.count()).join(''));
  protected readonly showCursor = computed(
    () => this.play() && this.count() < this.letters().length,
  );

  constructor() {
    effect((onCleanup) => {
      const total = this.letters().length;
      const speed = this.speed();
      if (!this.play()) {
        this.count.set(0);
        return;
      }
      if (this.paused() || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const timer = setInterval(() => {
        const next = Math.min(this.count() + 1, total);
        this.count.set(next);
        if (next === total) {
          clearInterval(timer);
          this.done.emit();
        }
      }, speed);
      onCleanup(() => clearInterval(timer));
    });
  }
}
