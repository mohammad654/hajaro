import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Breadcrumbs, Crumb } from './breadcrumbs';

/** Standard header for inner pages: breadcrumbs, eyebrow, the page's single H1 and a lead paragraph. */
@Component({
  selector: 'app-page-hero',
  imports: [Breadcrumbs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-hero">
      <div class="container">
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
  `,
})
export class PageHero {
  readonly title = input.required<string>();
  readonly eyebrow = input('');
  readonly lead = input('');
  readonly breadcrumbs = input<readonly Crumb[]>([]);
}
