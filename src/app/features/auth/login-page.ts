import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '../../core/api/api-error';
import { AuthService } from '../../core/auth/auth.service';
import { AuthUser, UserRole } from '../../core/models';
import { SeoService } from '../../core/seo/seo.service';
import { FieldError } from '../../shared/forms/field-error';
import { Icon } from '../../shared/ui/icon/icon';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-login-page',
  imports: [LocalePathPipe, ReactiveFormsModule, RouterLink, FieldError, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  readonly returnUrl = input<string | undefined>(undefined);

  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly showPassword = signal(false);

  protected readonly form = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
  });

  constructor() {
    inject(SeoService).update({
      title: 'Client Login',
      description: 'Sign in to your coaching dashboard.',
      noindex: true,
    });
    if (this.auth.isDemoMode) {
      this.form.controls.password.clearValidators();
      this.form.controls.password.updateValueAndValidity();
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.authenticate(this.auth.login(email, password));
    // Never keep the password in memory longer than needed.
    this.form.controls.password.reset();
  }

  protected demo(role: UserRole): void {
    this.authenticate(this.auth.loginAsDemo(role));
  }

  private authenticate(request: ReturnType<AuthService['login']>): void {
    this.loading.set(true);
    this.error.set('');
    request.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (user: AuthUser) => void this.router.navigateByUrl(this.safeReturnUrl(user)),
      error: (e: unknown) =>
        this.error.set(
          e instanceof ApiError
            ? e.message
            : 'Sign-in failed. Please check your details and try again.',
        ),
    });
  }

  /** Only allow same-site relative redirects (prevents open-redirect attacks). */
  private safeReturnUrl(user: AuthUser): string {
    const url = this.returnUrl();
    const home = this.auth.homeFor(user.role);
    if (!url || !url.startsWith('/') || url.startsWith('//')) return home;
    return url.startsWith(home) ? url : home;
  }
}
