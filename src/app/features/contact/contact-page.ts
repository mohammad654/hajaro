import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SITE_CONFIG } from '../../core/config/site.config';
import { ClientReady } from '../../core/services/client-ready';
import { applyPageSeo } from '../../core/seo/page-seo';
import { Icon } from '../../shared/ui/icon/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { WHATSAPP_PATH, whatsappHref } from '../../shared/ui/whatsapp-button';
import { COACHING_STEPS } from '../home/home.content';
import { ContactForm } from './contact-form';

@Component({
  selector: 'app-contact-page',
  imports: [PageHero, ContactForm, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      i18n-eyebrow
      eyebrow="Contact"
      i18n-title
      title="Let's talk"
      i18n-lead
      lead="Tell me your goal and a bit about your week. I read every message myself, and the first intro is free, with no strings attached."
      [breadcrumbs]="breadcrumbs"
    />

    <section class="section">
      <div class="container split split--sidebar">
        @if (ready()) {
          <app-contact-form
            [packageId]="package()"
            [serviceSlug]="service()"
            [programSlug]="program()"
          />
        } @else {
          <app-contact-form />
        }

        <aside class="stack sticky-aside" i18n-aria-label aria-label="Contact details">
          <div class="card">
            <h2 class="aside-title" i18n>What happens next</h2>
            <ol class="numbered-list text-small">
              @for (step of steps; track step.title) {
                <li>
                  <strong>{{ step.title }}</strong><br /><span class="text-muted">{{
                    step.description
                  }}</span>
                </li>
              }
            </ol>
          </div>
          <div class="card card--flat">
            <h2 class="aside-title" i18n>Direct contact</h2>
            <ul class="contact-list">
              <li>
                <app-icon name="mail" [size]="18" />
                <a [href]="'mailto:' + contact.email">{{ contact.email }}</a>
              </li>
              @if (contact.phone) {
                <li>
                  <app-icon name="phone" [size]="18" />
                  <a [href]="'tel:' + contact.phone">{{ contact.phone }}</a>
                </li>
              }
              @if (whatsapp; as whatsapp) {
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="wa-icon"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path [attr.d]="whatsappPath" />
                  </svg>
                  <a [href]="whatsapp" target="_blank" rel="noopener noreferrer" i18n>
                    Chat on WhatsApp<span class="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              }
              <li><app-icon name="map-pin" [size]="18" /> {{ contact.serviceArea }}</li>
              <li><app-icon name="clock" [size]="18" /> {{ contact.responseTime }}</li>
            </ul>
          </div>
          <p class="disclaimer">
            <app-icon name="shield" [size]="16" />
            <ng-container i18n
              >Your details are sent over a secure connection and used only to answer your
              message.</ng-container
            >
          </p>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .aside-title {
      font-size: var(--fs-lg);
    }
    .contact-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: var(--sp-3);
      font-size: var(--fs-sm);
    }
    .contact-list li {
      display: flex;
      align-items: center;
      gap: var(--sp-2);
    }
    .contact-list app-icon {
      color: var(--c-accent);
    }
    .contact-list .wa-icon {
      flex-shrink: 0;
      color: #25d366;
    }
  `,
})
export class ContactPage {
  /** Query parameters forwarded to the form once hydrated. */
  readonly package = input<string | undefined>(undefined);
  readonly service = input<string | undefined>(undefined);
  readonly program = input<string | undefined>(undefined);

  protected readonly ready = inject(ClientReady).ready;
  protected readonly contact = SITE_CONFIG.contact;
  protected readonly steps = COACHING_STEPS;
  protected readonly whatsapp = whatsappHref();
  protected readonly whatsappPath = WHATSAPP_PATH;
  protected readonly breadcrumbs = [{ label: $localize`Contact`, url: '/contact' }];

  constructor() {
    applyPageSeo('contact', {
      title: $localize`Contact & Book a Free Intro`,
      description: $localize`Get in touch to plan a free intro. Tell me your goal and I'll reply within two working days.`,
    });
  }
}
