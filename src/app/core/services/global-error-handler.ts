import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ApiError } from '../api/api-error';
import { ToastService } from './toast.service';

const UNEXPECTED_ERROR = $localize`An unexpected error occurred. Please try again.`;

/** Stack frames from browser extensions: their errors are not ours to report to the visitor. */
const EXTENSION_FRAME = /(?:chrome|moz|safari(?:-web)?)-extension:\/\//;

/**
 * Last line of defence for uncaught errors.
 * Logs details for developers and shows a friendly, non-technical message to the visitor —
 * but only for errors that can come from this app and that the visitor might act on.
 * Hook a monitoring service (e.g. Sentry) into `report` when one is adopted.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);

  handleError(error: unknown): void {
    this.report(error);
    if (isNoise(error)) return;
    this.toast.error(error instanceof ApiError ? error.message : UNEXPECTED_ERROR);
  }

  private report(error: unknown): void {
    console.error('[Hajaro] Unhandled error', error);
  }
}

/**
 * Errors that reach the handler but mean nothing to a visitor:
 * - window `error` events without an Error object, which Angular wraps with the event as `cause`:
 *   the benign "ResizeObserver loop …" warning and the opaque "Script error." from cross-origin
 *   scripts (third-party tags, extensions);
 * - AbortErrors: an interrupted view transition or a cancelled fetch is not a failure;
 * - errors thrown from browser-extension code.
 */
function isNoise(error: unknown): boolean {
  if (!(error instanceof Error)) return error == null;
  if (error.name === 'AbortError') return true;
  if (typeof ErrorEvent !== 'undefined' && error.cause instanceof ErrorEvent) {
    const { message, filename } = error.cause;
    return (
      !message ||
      message.startsWith('ResizeObserver loop') ||
      message === 'Script error.' ||
      EXTENSION_FRAME.test(filename)
    );
  }
  return EXTENSION_FRAME.test(error.stack ?? '');
}
