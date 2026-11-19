import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

/**
 * Consistent image container. Renders an optimised, lazy-loaded image when a source is configured,
 * otherwise a branded placeholder — so layouts never shift and nothing looks broken
 * before real photography is supplied.
 * Parents can adjust it through custom properties: --frame-radius, --frame-border, --frame-zoom.
 */
@Component({
  selector: 'app-media-frame',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="frame" [style.aspect-ratio]="ratio()">
      @if (src(); as source) {
        <img
          [ngSrc]="source"
          [alt]="alt()"
          fill
          [priority]="priority()"
          [sizes]="sizes()"
          [style.object-position]="position()"
        />
      } @else {
        <div class="frame__placeholder" role="img" [attr.aria-label]="alt() || imageComingSoon">
          <span class="frame__mark" aria-hidden="true">{{ monogram() }}</span>
          @if (caption()) {
            <span class="frame__caption">{{ caption() }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .frame {
      position: relative;
      overflow: hidden;
      border-radius: var(--frame-radius, var(--radius-lg));
      background: var(--c-surface-2);
      border: var(--frame-border, 1px solid var(--c-border));
    }
    img {
      object-fit: cover;
      transform: var(--frame-zoom, none);
      transition: transform var(--dur-slow) var(--ease);
    }
    .frame__placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--sp-3);
      background:
        radial-gradient(80% 60% at 50% 30%, var(--c-accent-soft), transparent 70%),
        repeating-linear-gradient(135deg, var(--c-hover-tint) 0 2px, transparent 2px 14px),
        var(--c-surface);
    }
    .frame__mark {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: clamp(3rem, 2rem + 4vw, 6rem);
      line-height: 1;
      letter-spacing: var(--tracking);
      color: transparent;
      -webkit-text-stroke: 1.5px var(--c-accent-line);
    }
    .frame__caption {
      font-size: var(--fs-xs);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      color: var(--c-text-subtle);
    }
  `,
})
export class MediaFrame {
  protected readonly imageComingSoon = $localize`Image coming soon`;
  readonly src = input<string | null | undefined>(null);
  readonly alt = input('');
  readonly ratio = input('4 / 5');
  readonly position = input('center');
  readonly priority = input(false);
  readonly sizes = input('(min-width: 1024px) 50vw, 100vw');
  readonly monogram = input('H');
  readonly caption = input('');
}
