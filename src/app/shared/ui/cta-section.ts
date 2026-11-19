import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LocalePathPipe } from '../../core/i18n/current-locale';

/**
 * Closing conversion block used at the end of most pages (at most once per page, hence the fixed
 * heading id: a counter would differ between the prerendered HTML and the browser).
 */
@Component({
  selector: 'app-cta-section',
  imports: [NgOptimizedImage, LocalePathPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta__panel">
          <div class="cta__bg" aria-hidden="true">
            <img
              ngSrc="images/home/dumbbells-overhead-dark-floor.webp"
              alt=""
              fill
              sizes="(min-width: 1440px) 86vw, 100vw"
            />
          </div>
          <p class="eyebrow">{{ eyebrow() }}</p>
          <h2 id="cta-title">{{ title() }}</h2>
          <p class="cta__text">{{ text() }}</p>
          <div class="cluster cta__actions">
            <a class="btn btn--primary btn--lg" [routerLink]="primaryLink() | localePath">{{
              primaryLabel()
            }}</a>
            @if (secondaryLabel()) {
              <a class="btn btn--lg" [routerLink]="secondaryLink() | localePath">{{
                secondaryLabel()
              }}</a>
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
      padding: clamp(var(--sp-6), 1rem + 5vw, 5rem);
      border-radius: var(--radius-lg);
      border: 1px solid var(--c-accent-line);
      background:
        radial-gradient(70% 140% at 100% 0%, var(--c-accent-soft), transparent 60%),
        linear-gradient(135deg, var(--c-surface-2), var(--c-bg-elevated));
      text-align: center;
    }
    /* Photo behind the text, darkest in the middle where the copy sits. */
    .cta__bg {
      position: absolute;
      inset: 0;
    }
    .cta__bg img {
      object-fit: cover;
      object-position: center 40%;
    }
    .cta__bg::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(70% 140% at 100% 0%, var(--c-accent-soft), transparent 60%),
        radial-gradient(60% 80% at 50% 50%, var(--c-scrim-strong), var(--c-scrim));
    }
    .cta__panel > :not(.cta__bg) {
      position: relative;
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
  readonly eyebrow = input($localize`Free intro`);
  readonly title = input($localize`Tell me what you want to achieve`);
  readonly text = input(
    $localize`We'll talk about your goal, your training history and your week. I'll tell you honestly if I can help.`,
  );
  readonly primaryLabel = input($localize`Book a free intro`);
  readonly primaryLink = input('/contact');
  readonly secondaryLabel = input($localize`See packages`);
  readonly secondaryLink = input('/pricing');
}
