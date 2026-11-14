import { ChangeDetectionStrategy, Component, DOCUMENT, inject, input } from '@angular/core';

/**
 * Keyboard "skip to content" link. Moves focus programmatically because a plain `#id` link
 * would resolve against <base href="/"> and navigate to the homepage.
 */
@Component({
  selector: 'app-skip-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<a class="skip-link" [href]="'#' + target()" (click)="skip($event)">{{ label() }}</a>`,
})
export class SkipLink {
  private readonly document = inject(DOCUMENT);
  readonly target = input.required<string>();
  readonly label = input('Skip to main content');

  protected skip(event: Event): void {
    event.preventDefault();
    const element = this.document.getElementById(this.target());
    element?.focus();
    element?.scrollIntoView();
  }
}
