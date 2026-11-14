import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-consent-banner',
  imports: [LocalePathPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (analytics.needsConsent()) {
      <section class="consent" role="region" aria-label="Cookie consent">
        <p>
          We use optional analytics cookies to understand how the site is used and improve it. No
          data is collected unless you accept.
          <a [routerLink]="'/privacy' | localePath">Privacy policy</a>
        </p>
        <div class="cluster">
          <button type="button" class="btn btn--sm" (click)="analytics.setConsent('denied')">
            Decline
          </button>
          <button
            type="button"
            class="btn btn--sm btn--primary"
            (click)="analytics.setConsent('granted')"
          >
            Accept analytics
          </button>
        </div>
      </section>
    }
  `,
  styles: `
    .consent {
      position: fixed;
      left: var(--sp-4);
      right: var(--sp-4);
      bottom: var(--sp-4);
      z-index: 900;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-4);
      max-width: 860px;
      margin-inline: auto;
      padding: var(--sp-4) var(--sp-5);
      border: 1px solid var(--c-border-strong);
      border-radius: var(--radius);
      background: var(--c-surface-2);
      box-shadow: var(--shadow);
    }
    p {
      margin: 0;
      flex: 1 1 320px;
      font-size: var(--fs-sm);
      color: var(--c-text-muted);
    }
  `,
})
export class ConsentBanner {
  protected readonly analytics = inject(AnalyticsService);
}
