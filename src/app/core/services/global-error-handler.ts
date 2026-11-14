import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ApiError } from '../api/api-error';
import { ToastService } from './toast.service';

/**
 * Last line of defence for uncaught errors.
 * Logs details for developers and shows a friendly, non-technical message to the visitor.
 * Hook a monitoring service (e.g. Sentry) into `report` when one is adopted.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);

  handleError(error: unknown): void {
    this.report(error);
    const message =
      error instanceof ApiError ? error.message : 'An unexpected error occurred. Please try again.';
    this.toast.error(message);
  }

  private report(error: unknown): void {
    console.error('[Hajaro] Unhandled error', error);
  }
}
