import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type StorageArea = 'local' | 'session';

/**
 * SSR-safe wrapper around Web Storage.
 * All access is guarded so server rendering and privacy modes (where storage throws) never break the app.
 * Never use this for credentials or tokens.
 */
@Injectable({ providedIn: 'root' })
export class BrowserStorage {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private static readonly PREFIX = 'hajaro:';

  read<T>(key: string, area: StorageArea = 'local'): T | null {
    const store = this.store(area);
    if (!store) return null;
    try {
      const raw = store.getItem(BrowserStorage.PREFIX + key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  }

  write<T>(key: string, value: T, area: StorageArea = 'local'): boolean {
    const store = this.store(area);
    if (!store) return false;
    try {
      store.setItem(BrowserStorage.PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      // Quota exceeded or storage disabled.
      return false;
    }
  }

  remove(key: string, area: StorageArea = 'local'): void {
    try {
      this.store(area)?.removeItem(BrowserStorage.PREFIX + key);
    } catch {
      /* storage unavailable */
    }
  }

  private store(area: StorageArea): Storage | null {
    if (!this.isBrowser) return null;
    try {
      return area === 'local' ? window.localStorage : window.sessionStorage;
    } catch {
      return null;
    }
  }
}
