import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Number of sun rays in the wordmark. */
const RAY_COUNT = 21;

/**
 * Hajaro wordmark: "HAJAR" followed by a gold sun in place of the final O.
 * Inline SVG so the letters use the site font and the colours follow the design tokens. Decorative:
 * the surrounding link carries the accessible name. Height comes from `--logo-h` (default 2rem).
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 137 36" aria-hidden="true" focusable="false">
      <!-- textLength fixes the word's width, so the sun lines up whatever font is shown. -->
      <text class="logo__word" x="0" y="28" textLength="96">HAJAR</text>
      <g class="logo__sun" transform="translate(118 18)">
        @for (angle of rays; track angle) {
          <polygon points="0,-18 2,-11.5 -2,-11.5" [attr.transform]="'rotate(' + angle + ')'" />
        }
        <circle r="11.5" />
        <circle class="logo__ring" r="5.5" />
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }
    svg {
      height: var(--logo-h, 2rem);
      width: auto;
      overflow: visible;
    }
    .logo__word {
      fill: var(--c-text);
      font-family: var(--font-body);
      font-size: 26px;
      font-weight: 500;
      letter-spacing: 2px;
    }
    .logo__sun {
      fill: var(--c-accent);
    }
    .logo__ring {
      fill: none;
      stroke: rgb(var(--c-bg-rgb) / 28%);
      stroke-width: 1.5;
    }
  `,
})
export class Logo {
  protected readonly rays = Array.from({ length: RAY_COUNT }, (_, i) => (i * 360) / RAY_COUNT);
}
