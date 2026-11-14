import { DOCUMENT, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BrowserStorage } from './browser-storage.service';

type ConsentChoice = 'granted' | 'denied';
const CONSENT_KEY = 'consent:analytics';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GDPR-friendly analytics: Google Analytics 4 is only loaded when a measurement ID is configured
 * AND the visitor has explicitly consented. Without an ID, no banner is shown and nothing is tracked.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly storage = inject(BrowserStorage);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly measurementId = environment.analytics.gaMeasurementId;
  private loaded = false;

  private readonly choice = signal<ConsentChoice | null>(null);
  /** Set after hydration so the banner never causes a server/client markup mismatch. */
  private readonly initialized = signal(false);
  readonly needsConsent = computed(
    () => this.initialized() && !!this.measurementId && this.choice() === null,
  );

  /** Call once after hydration. */
  init(): void {
    if (!this.isBrowser || !this.measurementId) return;
    this.initialized.set(true);
    this.choice.set(this.storage.read<ConsentChoice>(CONSENT_KEY));
    if (this.choice() === 'granted') this.load();
  }

  setConsent(choice: ConsentChoice): void {
    this.choice.set(choice);
    this.storage.write(CONSENT_KEY, choice);
    if (choice === 'granted') this.load();
  }

  private load(): void {
    if (this.loaded || !/^G-[A-Z0-9]+$/.test(this.measurementId)) return;
    this.loaded = true;
    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    this.document.head.appendChild(script);

    const w = this.document.defaultView as Window;
    w.dataLayer = w.dataLayer ?? [];
    w.gtag = (...args: unknown[]) => w.dataLayer!.push(args);
    w.gtag('js', new Date());
    // Page views are sent manually on each SPA navigation.
    w.gtag('config', this.measurementId, { anonymize_ip: true, send_page_view: false });
    this.trackPage(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.trackPage(e.urlAfterRedirects));
  }

  private trackPage(path: string): void {
    const w = this.document.defaultView as Window;
    w.gtag?.('event', 'page_view', {
      page_path: path,
      page_location: w.location.href,
      page_title: this.document.title,
    });
  }
}
