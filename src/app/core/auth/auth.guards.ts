import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserRole } from '../models';
import { AuthService } from './auth.service';

/**
 * Restricts a route to a role. Unauthenticated visitors are sent to sign in;
 * authenticated users with the wrong role are sent to their own home area.
 * Frontend guards are a UX layer only — the API must enforce authorisation.
 */
export const roleGuard =
  (role: UserRole): CanActivateFn =>
  (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    return auth.ensureSession().pipe(
      map((user) => {
        if (!user)
          return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
        if (user.role !== role) return router.createUrlTree([auth.homeFor(user.role)]);
        return true;
      }),
    );
  };

/** Sends already-signed-in users from the login page to their dashboard. */
export const guestOnlyGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth
    .ensureSession()
    .pipe(map((user) => (user ? router.createUrlTree([auth.homeFor(user.role)]) : true)));
};
