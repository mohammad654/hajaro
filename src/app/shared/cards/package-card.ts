import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BILLING_PERIOD_LABELS, CoachingPackage } from '../../core/models';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-package-card',
  imports: [LocalePathPipe, CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="card package"
      [class.card--featured]="pkg().highlighted"
      [attr.aria-labelledby]="'pkg-' + pkg().id"
    >
      @if (pkg().highlighted) {
        <span class="package__flag" i18n>Most popular</span>
      }
      <h3 class="package__name" [id]="'pkg-' + pkg().id">{{ pkg().name }}</h3>
      <p class="text-muted text-small">{{ pkg().tagline }}</p>
      <p class="package__price">
        <span class="package__amount">{{
          pkg().price | currency: pkg().currency : 'symbol' : '1.0-0'
        }}</span>
        <span class="package__period">{{ periodLabel() }}</span>
      </p>
      <p class="package__duration">{{ pkg().duration }}</p>

      @if (detailed()) {
        <dl class="package__details">
          <div>
            <dt i18n>Training plan</dt>
            <dd>{{ pkg().trainingPlan }}</dd>
          </div>
          <div>
            <dt i18n>Nutrition</dt>
            <dd>{{ pkg().nutrition }}</dd>
          </div>
          <div>
            <dt i18n>Check-ins</dt>
            <dd>{{ pkg().checkIns }}</dd>
          </div>
          <div>
            <dt i18n>Communication</dt>
            <dd>{{ pkg().communication }}</dd>
          </div>
          <div>
            <dt i18n>Support level</dt>
            <dd>{{ pkg().support }}</dd>
          </div>
        </dl>
      }

      <ul class="check-list package__features">
        @for (feature of pkg().features; track feature) {
          <li>{{ feature }}</li>
        }
      </ul>
      <a
        class="btn btn--block"
        [class.btn--primary]="pkg().highlighted"
        [routerLink]="'/contact' | localePath"
        [queryParams]="{ package: pkg().id }"
      >
        {{ pkg().ctaLabel }}
      </a>
    </article>
  `,
  styles: `
    .package {
      display: flex;
      flex-direction: column;
      gap: var(--sp-3);
      height: 100%;
    }
    .package__flag {
      position: absolute;
      top: 0;
      right: var(--sp-5);
      transform: translateY(-50%);
      padding: var(--sp-1) var(--sp-3);
      border-radius: var(--radius-pill);
      background: var(--c-accent);
      color: var(--c-on-accent);
      font-size: var(--fs-xs);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .package__name {
      font-size: var(--fs-xl);
      margin: 0;
    }
    p {
      margin: 0;
    }
    .package__price {
      display: flex;
      align-items: baseline;
      gap: var(--sp-2);
      margin-top: var(--sp-2);
    }
    .package__amount {
      font-family: var(--font-display);
      font-size: var(--fs-2xl);
      font-weight: 700;
      line-height: 1;
    }
    .package__period,
    .package__duration {
      color: var(--c-text-subtle);
      font-size: var(--fs-sm);
    }
    .package__details {
      display: grid;
      gap: var(--sp-3);
      margin: var(--sp-2) 0;
      padding: var(--sp-4) 0;
      border-block: 1px solid var(--c-border);
    }
    dt {
      font-size: var(--fs-xs);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--c-text-subtle);
    }
    dd {
      margin: 0;
      font-size: var(--fs-sm);
    }
    .package__features {
      flex: 1;
      font-size: var(--fs-sm);
      margin-bottom: var(--sp-4);
    }
  `,
})
export class PackageCard {
  readonly pkg = input.required<CoachingPackage>();
  readonly detailed = input(false);

  protected periodLabel(): string {
    return BILLING_PERIOD_LABELS[this.pkg().billingPeriod];
  }
}
