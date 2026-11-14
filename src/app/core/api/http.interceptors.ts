import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { toApiError } from './api-error';

const isApiRequest = (url: string): boolean => url.startsWith(environment.apiBaseUrl);

/**
 * Sends the httpOnly session cookie with API requests.
 * Tokens are never read or stored by frontend code.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) =>
  next(isApiRequest(req.url) ? req.clone({ withCredentials: true }) : req);

/** Normalises HTTP failures into ApiError and redirects to sign-in when a session expires. */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        isApiRequest(req.url) &&
        !req.url.includes('/auth/')
      ) {
        void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => toApiError(error));
    }),
  );
};
