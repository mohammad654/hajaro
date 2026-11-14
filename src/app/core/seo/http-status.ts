import { RESPONSE_INIT, inject } from '@angular/core';

/**
 * Returns a function that marks the current server response as 404.
 * Used by detail pages when a slug does not exist, so search engines never index soft-404s.
 * No-op in the browser.
 */
export function injectNotFoundStatus(): () => void {
  const responseInit = inject(RESPONSE_INIT, { optional: true });
  return () => {
    if (responseInit) responseInit.status = 404;
  };
}
