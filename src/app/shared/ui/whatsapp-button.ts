import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SITE_CONFIG } from '../../core/config/site.config';

/**
 * Click-to-chat link (https://wa.me/<digits>?text=…).
 * TODO: set `SITE_CONFIG.contact.whatsapp.number` — until then the link has no number, so WhatsApp
 * asks the visitor to pick a contact instead of opening a chat with you.
 */
export function whatsappHref(message: string = SITE_CONFIG.contact.whatsapp.message): string {
  const digits = SITE_CONFIG.contact.whatsapp.number.replace(/\D/g, '');
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

/** WhatsApp brand glyph (24×24, filled). */
export const WHATSAPP_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';

/** Floating "Chat on WhatsApp" button, fixed to the bottom-right of public pages. */
@Component({
  selector: 'app-whatsapp-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (href; as href) {
      <a
        class="wa"
        [href]="href"
        target="_blank"
        rel="noopener noreferrer"
        i18n-aria-label
        aria-label="Chat with us on WhatsApp (opens in a new tab)"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path [attr.d]="path" />
        </svg>
        <span class="wa__label" i18n>Chat on WhatsApp</span>
      </a>
    }
  `,
  styles: `
    .wa {
      position: fixed;
      right: calc(var(--sp-4) + env(safe-area-inset-right, 0px));
      bottom: calc(var(--sp-4) + env(safe-area-inset-bottom, 0px));
      /* Below the sticky header (100) so the mobile menu covers it, and below the consent banner. */
      z-index: 90;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--sp-2);
      width: 56px;
      height: 56px;
      border-radius: var(--radius-pill);
      background: #25d366;
      color: #fff;
      box-shadow: var(--shadow);
      text-decoration: none;
      font-weight: 600;
      font-size: var(--fs-sm);
      transition:
        transform var(--dur) var(--ease),
        background-color var(--dur) var(--ease);
    }
    .wa:hover {
      background: #1ebe5b;
      transform: translateY(-2px);
      color: #fff;
    }
    .wa:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .wa__label {
      display: none;
    }
    @media (min-width: 768px) {
      .wa {
        width: auto;
        padding: 0 var(--sp-5) 0 var(--sp-4);
      }
      .wa__label {
        display: inline;
      }
    }
    :host-context(body.is-scroll-locked) .wa {
      display: none;
    }
    @media print {
      .wa {
        display: none;
      }
    }
  `,
})
export class WhatsappButton {
  protected readonly href = whatsappHref();
  protected readonly path = WHATSAPP_PATH;
}
