import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SITE_CONFIG } from '../../../core/config/site.config';
import { ClientStore, SessionStore } from '../../../core/data-access/portal.stores';
import { ToastService } from '../../../core/services/toast.service';
import { FieldError } from '../../../shared/forms/field-error';
import { phoneValidator } from '../../../shared/forms/validation-messages';
import { ClientPortal } from '../client-portal.service';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, FieldError],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <p class="eyebrow">Account</p>
      <h1>Profile & privacy</h1>
    </header>

    <section class="card form-card" aria-labelledby="profile-title">
      <h2 id="profile-title" class="h-sm">Personal details</h2>
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="form-grid">
          <div class="field">
            <label for="p-name">Name *</label>
            <input
              id="p-name"
              class="input"
              formControlName="name"
              autocomplete="name"
              aria-describedby="p-name-err"
            />
            <app-field-error [control]="form.controls.name" id="p-name-err" label="Name" />
          </div>
          <div class="field">
            <label for="p-email">Email</label>
            <input id="p-email" class="input" [value]="portal.profile()?.email ?? ''" disabled />
            <span class="field__hint">Contact your coach to change your login email.</span>
          </div>
          <div class="field">
            <label for="p-phone">Phone</label>
            <input
              id="p-phone"
              class="input"
              type="tel"
              formControlName="phone"
              autocomplete="tel"
              aria-describedby="p-phone-err"
            />
            <app-field-error [control]="form.controls.phone" id="p-phone-err" label="Phone" />
          </div>
          <div class="field">
            <label for="p-goal">Main goal *</label>
            <input id="p-goal" class="input" formControlName="goal" aria-describedby="p-goal-err" />
            <app-field-error [control]="form.controls.goal" id="p-goal-err" label="Goal" />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn--primary" [disabled]="saving() || form.pristine">
            Save changes
          </button>
        </div>
      </form>
    </section>

    <section class="card" aria-labelledby="privacy-title">
      <h2 id="privacy-title" class="h-sm">Your data</h2>
      <p class="text-small text-muted">
        Under the GDPR you can access, export and request deletion of your personal data at any
        time.
      </p>
      <div class="cluster">
        <button type="button" class="btn" (click)="exportData()">Download my data (JSON)</button>
        <a class="btn btn--danger" [href]="deletionMailto">Request account deletion</a>
      </div>
    </section>
  `,
  styleUrl: './dashboard-pages.scss',
})
export class ProfilePage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly clients = inject(ClientStore);
  private readonly sessions = inject(SessionStore);
  private readonly toast = inject(ToastService);
  private readonly document = inject(DOCUMENT);
  protected readonly portal = inject(ClientPortal);
  protected readonly saving = signal(false);
  protected readonly deletionMailto = `mailto:${SITE_CONFIG.contact.email}?subject=${encodeURIComponent('Account deletion request')}`;

  protected readonly form = this.fb.group({
    name: this.fb.control('', [Validators.required, Validators.maxLength(80)]),
    phone: this.fb.control('', [phoneValidator]),
    goal: this.fb.control('', [Validators.required, Validators.maxLength(160)]),
  });

  constructor() {
    effect(() => {
      const p = this.portal.profile();
      if (p && this.form.pristine)
        this.form.reset({ name: p.name, phone: p.phone ?? '', goal: p.goal });
    });
  }

  protected save(): void {
    const profile = this.portal.profile();
    if (!profile || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.saving.set(true);
    this.clients
      .patch(profile.id, {
        name: v.name.trim(),
        phone: v.phone.trim() || undefined,
        goal: v.goal.trim(),
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.form.markAsPristine();
          this.toast.success('Profile updated.');
        },
        error: (e: Error) => this.toast.error(e.message),
      });
  }

  /** Data portability: everything the client can see about themselves, as a JSON file. */
  protected exportData(): void {
    const data = {
      exportedAt: new Date().toISOString(),
      profile: this.portal.profile(),
      measurements: this.portal.measurements(),
      checkIns: this.portal.checkIns(),
      appointments: this.portal.appointments(),
      notifications: this.portal.notifications(),
      workoutSessions: this.sessions.forOwner(this.portal.userId()),
      progressPhotos: this.portal.photos().map(({ id, date, pose }) => ({ id, date, pose })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = this.document.createElement('a');
    link.href = url;
    link.download = 'my-coaching-data.json';
    link.click();
    URL.revokeObjectURL(url);
  }
}
