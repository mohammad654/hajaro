import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/schema.builders';

export interface Crumb {
  readonly label: string;
  readonly url: string;
}

/** Visible breadcrumb trail that also publishes matching BreadcrumbList structured data. */
@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Breadcrumb">
      <ol>
        @for (crumb of trail(); track crumb.url; let last = $last) {
          <li>
            @if (last) {
              <span aria-current="page">{{ crumb.label }}</span>
            } @else {
              <a [routerLink]="crumb.url">{{ crumb.label }}</a>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    ol {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-2);
      list-style: none;
      margin: 0 0 var(--sp-5);
      padding: 0;
      font-size: var(--fs-xs);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--c-text-subtle);
    }
    li:not(:last-child)::after {
      content: '/';
      margin-left: var(--sp-2);
      opacity: 0.6;
    }
    a {
      color: var(--c-text-muted);
      text-decoration: none;
    }
    a:hover {
      color: var(--c-accent);
    }
    [aria-current] {
      color: var(--c-text);
    }
  `,
})
export class Breadcrumbs {
  private readonly seo = inject(SeoService);
  /** Items after "Home" — Home is prepended automatically. */
  readonly items = input.required<readonly Crumb[]>();

  protected trail(): readonly Crumb[] {
    return [{ label: 'Home', url: '/' }, ...this.items()];
  }

  constructor() {
    effect(() => {
      this.seo.setPageSchema(
        'breadcrumbs',
        breadcrumbSchema((p) => this.seo.absoluteUrl(p), this.trail()),
      );
    });
  }
}
