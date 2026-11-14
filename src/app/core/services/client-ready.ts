import { ApplicationRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Becomes `true` once the app is running in the browser and hydration has finished.
 *
 * Prerendered HTML is generated without query parameters, sessions or browser storage.
 * Any UI that depends on those must wait for this flag so the first client render matches the
 * server markup exactly (avoiding hydration mismatches), then update immediately afterwards.
 */
@Injectable({ providedIn: 'root' })
export class ClientReady {
  private readonly state = signal(false);
  readonly ready = this.state.asReadonly();

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      void inject(ApplicationRef)
        .whenStable()
        .then(() => this.state.set(true));
    }
  }
}
