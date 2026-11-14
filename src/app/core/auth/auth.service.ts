import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, delay, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiError } from '../api/api-error';
import { DEMO_USERS } from '../data/portal-demo.data';
import { AuthUser, UserRole } from '../models';
import { BrowserStorage } from '../services/browser-storage.service';

const SESSION_KEY = 'session-user';
const MOCK_LATENCY_MS = 400;

/**
 * Authentication state.
 *
 * - API mode: credentials are POSTed once to `/auth/login`; the backend sets an httpOnly session
 *   cookie. The frontend never sees or stores a token or password. `/auth/me` restores the session.
 * - Demo mode: signs in to built-in demo accounts. Only the public user profile (id, name, email,
 *   role) is kept in sessionStorage so a refresh does not sign the user out.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(BrowserStorage);
  private readonly userState = signal<AuthUser | null>(null);
  private sessionChecked = false;

  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => this.userState() !== null);
  readonly isAdmin = computed(() => this.userState()?.role === 'admin');
  readonly isDemoMode = environment.useMockApi;

  constructor() {
    if (this.isDemoMode) {
      this.userState.set(this.storage.read<AuthUser>(SESSION_KEY, 'session'));
      this.sessionChecked = true;
    }
  }

  /** Resolves the current session (once) — used by route guards. */
  ensureSession(): Observable<AuthUser | null> {
    if (this.sessionChecked) return of(this.userState());
    return this.http.get<AuthUser>(`${environment.apiBaseUrl}/auth/me`).pipe(
      tap((user) => this.userState.set(user)),
      catchError(() => of(null)),
      tap(() => (this.sessionChecked = true)),
    );
  }

  login(email: string, password: string): Observable<AuthUser> {
    if (this.isDemoMode) {
      const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) {
        return throwError(
          () => new ApiError('No demo account matches that email address.', 401),
        ).pipe(delay(MOCK_LATENCY_MS));
      }
      return of(user).pipe(
        delay(MOCK_LATENCY_MS),
        tap((u) => this.setUser(u)),
      );
    }
    return this.http
      .post<AuthUser>(`${environment.apiBaseUrl}/auth/login`, { email: email.trim(), password })
      .pipe(tap((u) => this.setUser(u)));
  }

  loginAsDemo(role: UserRole): Observable<AuthUser> {
    const user = DEMO_USERS.find((u) => u.role === role);
    return user
      ? this.login(user.email, '')
      : throwError(() => new ApiError('Demo account unavailable.'));
  }

  logout(): void {
    const finish = () => {
      this.setUser(null);
      void this.router.navigateByUrl('/');
    };
    if (this.isDemoMode) {
      finish();
      return;
    }
    this.http
      .post(`${environment.apiBaseUrl}/auth/logout`, {})
      .pipe(
        map(() => undefined),
        catchError(() => of(undefined)),
      )
      .subscribe(finish);
  }

  /** Where a user should land after signing in. */
  homeFor(role: UserRole): string {
    return role === 'admin' ? '/admin' : '/dashboard';
  }

  private setUser(user: AuthUser | null): void {
    this.userState.set(user);
    this.sessionChecked = true;
    if (!this.isDemoMode) return;
    if (user) this.storage.write(SESSION_KEY, user, 'session');
    else this.storage.remove(SESSION_KEY, 'session');
  }
}
