import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Breadcrumbs, Crumb } from './breadcrumbs';
import { MediaFrame } from './media-frame';

/**
 * Standard header for inner pages: breadcrumbs, eyebrow, the page's single H1 and a lead paragraph,
 * with an optional photo beside the text.
 */
@Component({
  selector: 'app-page-hero',
  imports: [Breadcrumbs, MediaFrame],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-hero" [class.page-hero--media]="imageSrc()">
      <div class="container page-hero__inner">
        <div>
          @if (breadcrumbs().length) {
            <app-breadcrumbs [items]="breadcrumbs()" />
          }
          @if (eyebrow()) {
            <p class="eyebrow">{{ eyebrow() }}</p>
          }
          <h1>{{ title() }}</h1>
          @if (lead()) {
            <p class="lead">{{ lead() }}</p>
          }
          <ng-content />
        </div>
        @if (imageSrc(); as src) {
          <app-media-frame
            [src]="src"
            [alt]="imageAlt()"
            ratio="3 / 2"
            [position]="imagePosition()"
            [priority]="true"
            sizes="(min-width: 1080px) 45vw, 100vw"
          />
        }
      </div>
    </header>
  `,
  styles: `
    .page-hero {
      position: relative;
      padding: calc(var(--sp-8) + var(--sp-4)) 0 var(--sp-8);
      background:
        radial-gradient(60% 120% at 85% 0%, rgb(232 176 74 / 10%), transparent 60%),
        linear-gradient(180deg, var(--c-bg-elevated), var(--c-bg));
      border-bottom: 1px solid var(--c-border);
      overflow: hidden;
    }
    .page-hero::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--c-accent-line), transparent);
    }
    h1 {
      max-width: 18ch;
    }
    .lead {
      margin-bottom: 0;
    }
    .page-hero--media .page-hero__inner {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--sp-6);
    }
    @media (min-width: 1080px) {
      .page-hero--media .page-hero__inner {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--sp-7);
        align-items: center;
      }
    }
  `,
})
export class PageHero {
  readonly title = input.required<string>();
  readonly eyebrow = input('');
  readonly lead = input('');
  readonly breadcrumbs = input<readonly Crumb[]>([]);
  readonly imageSrc = input('');
  readonly imageAlt = input('');
  readonly imagePosition = input('center');
}
