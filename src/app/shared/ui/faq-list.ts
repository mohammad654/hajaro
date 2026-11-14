import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FaqItem } from '../../core/models';

/**
 * Accessible FAQ accordion built on native <details>/<summary> — keyboard and screen-reader
 * friendly with no JavaScript. FAQPage structured data is intentionally not emitted: Google limits
 * FAQ rich results to authoritative government and health sites.
 */
@Component({
  selector: 'app-faq-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="faq">
      @for (item of items(); track item.id) {
        <details>
          <summary>
            <span>{{ item.question }}</span>
            <span class="faq__icon" aria-hidden="true"></span>
          </summary>
          <p>{{ item.answer }}</p>
        </details>
      }
    </div>
  `,
  styles: `
    .faq {
      border-top: 1px solid var(--c-border);
    }
    details {
      border-bottom: 1px solid var(--c-border);
    }
    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-4);
      padding: var(--sp-5) 0;
      cursor: pointer;
      list-style: none;
      font-weight: 600;
      font-size: var(--fs-md);
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary:hover {
      color: var(--c-accent);
    }
    .faq__icon {
      position: relative;
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
    .faq__icon::before,
    .faq__icon::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 14px;
      height: 2px;
      background: var(--c-accent);
      transition: transform var(--dur) var(--ease);
    }
    .faq__icon::after {
      transform: rotate(90deg);
    }
    details[open] .faq__icon::after {
      transform: rotate(0deg);
    }
    p {
      color: var(--c-text-muted);
      padding-bottom: var(--sp-5);
      margin: 0;
      max-width: 70ch;
    }
  `,
})
export class FaqList {
  readonly items = input.required<readonly FaqItem[]>();
}
