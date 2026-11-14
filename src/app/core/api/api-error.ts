import { HttpErrorResponse } from '@angular/common/http';

/** Normalised error surfaced to the UI. Messages are safe to display to end users. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number = 0,
    readonly fieldErrors: Readonly<Record<string, string>> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const STATUS_MESSAGES: Readonly<Record<number, string>> = {
  0: 'We could not reach the server. Please check your connection and try again.',
  400: 'Some of the information provided is invalid. Please review the form.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested information could not be found.',
  409: 'This record was changed elsewhere. Please refresh and try again.',
  422: 'Some of the information provided is invalid. Please review the form.',
  429: 'Too many requests. Please wait a moment and try again.',
};

const FALLBACK_MESSAGE = 'Something went wrong on our side. Please try again shortly.';

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { message?: unknown; errors?: unknown } | null;
    const fieldErrors =
      body && typeof body.errors === 'object' && body.errors !== null
        ? (body.errors as Record<string, string>)
        : {};
    const message = STATUS_MESSAGES[error.status] ?? FALLBACK_MESSAGE;
    return new ApiError(message, error.status, fieldErrors);
  }
  return new ApiError(FALLBACK_MESSAGE);
}
