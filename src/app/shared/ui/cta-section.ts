import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Closing conversion block used at the end of most pages. */
@Component({
  selector: 'app-cta-section',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta" [attr.aria-labelledby]="headingId">
      <div class="container">
        <div class="cta__panel">
          <p class="eyebrow">{{ eyebrow() }}</p>
          <h2 [id]="headingId">{{ title() }}</h2>
          <p class="cta__text">{{ text() }}</p>
          <div class="cluster cta__actions">
            <a class="btn btn--primary btn--lg" [routerLink]="primaryLink()">{{
              primaryLabel()
            }}</a>
            @if (secondaryLabel()) {
              <a class="btn btn--lg" [routerLink]="secondaryLink()">{{ secondaryLabel() }}</a>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .cta {
      padding-block: var(--section-y);
    }
    .cta__panel {
      position: relative;
      overflow: hidden;
      padding: clamp(2rem, 1rem + 5vw, 5rem);
      border-radius: var(--radius-lg);
      border: 1px solid var(--c-accent-line);
      background:
        radial-gradient(70% 140% at 100% 0%, rgb(232 176 74 / 18%), transparent 60%),
        linear-gradient(135deg, var(--c-surface-2), var(--c-bg-elevated));
      text-align: center;
    }
    .eyebrow {
      justify-content: center;
    }
    h2 {
      max-width: 20ch;
      margin-inline: auto;
    }
    .cta__text {
      max-width: 56ch;
      margin: 0 auto var(--sp-6);
      color: var(--c-text-muted);
      font-size: var(--fs-md);
    }
    .cta__actions {
      justify-content: center;
    }
  `,
})
export class CtaSection {
  private static count = 0;
  protected readonly headingId = `cta-heading-${++CtaSection.count}`;

  readonly eyebrow = input('Ready when you are');
  readonly title = input('Start your transformation');
  readonly text = input(
    'Book a free, no-obligation consultation. We will talk about your goals, your training history and the right way to work together.',
  );
  readonly primaryLabel = input('Book a free consultation');
  readonly primaryLink = input('/contact');
  readonly secondaryLabel = input('View coaching packages');
  readonly secondaryLink = input('/pricing');
}
