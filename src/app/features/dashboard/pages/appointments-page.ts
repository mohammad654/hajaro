import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { newId } from '../../../core/api/entity-repository';
import { BookingStore } from '../../../core/data-access/portal.stores';
import { BOOKING_TYPE_LABELS, Booking } from '../../../core/models';
import { ToastService } from '../../../core/services/toast.service';
import { FieldError } from '../../../shared/forms/field-error';
import { ClientPortal } from '../client-portal.service';

const DEFAULT_DURATION_MINUTES = 30;

@Component({
  selector: 'app-appointments-page',
  imports: [DatePipe, ReactiveFormsModule, FieldError],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <p class="eyebrow">Appointments</p>
      <h1>Sessions & calls</h1>
    </header>

    <section aria-labelledby="upcoming" class="form-card">
      <h2 id="upcoming">Upcoming</h2>
      @if (portal.appointments().length) {
        <ul class="list">
          @for (b of portal.appointments(); track b.id) {
            <li class="card list-item">
              <div>
                <strong>{{ typeLabels[b.type] }}</strong>
                <p class="text-small text-muted">
                  {{ b.startsAt | date: 'EEEE d MMMM y, HH:mm' }} · {{ b.durationMinutes }} min ·
                  {{ b.location }}
                </p>
              </div>
              <span class="badge" [class.badge--success]="b.status === 'confirmed'">{{
                b.status
              }}</span>
            </li>
          }
        </ul>
      } @else {
        <p class="text-muted">No upcoming appointments.</p>
      }
    </section>

    <section class="card" aria-labelledby="request-title">
      <h2 id="request-title" class="h-sm">Request an appointment</h2>
      <p class="text-small text-muted">Your coach will confirm or suggest an alternative time.</p>
      <form [formGroup]="form" (ngSubmit)="request()" novalidate>
        <div class="form-grid">
          <div class="field">
            <label for="b-type">Type</label>
            <select id="b-type" class="select" formControlName="type">
              @for (t of typeOptions; track t[0]) {
                <option [value]="t[0]">{{ t[1] }}</option>
              }
            </select>
          </div>
          <div class="field">
            <label for="b-when">Preferred date & time *</label>
            <input
              id="b-when"
              class="input"
              type="datetime-local"
              formControlName="startsAt"
              [min]="minDate"
              aria-describedby="b-when-err"
            />
            <app-field-error
              [control]="form.controls.startsAt"
              id="b-when-err"
              label="Date and time"
            />
          </div>
          <div class="field span-2">
            <label for="b-notes">Notes</label>
            <input id="b-notes" class="input" formControlName="notes" maxlength="300" />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn--primary" [disabled]="saving()">
            Request appointment
          </button>
        </div>
      </form>
    </section>
  `,
  styleUrl: './dashboard-pages.scss',
})
export class AppointmentsPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(BookingStore);
  private readonly toast = inject(ToastService);
  protected readonly portal = inject(ClientPortal);
  protected readonly saving = signal(false);
  protected readonly typeLabels = BOOKING_TYPE_LABELS;
  protected readonly typeOptions = Object.entries(BOOKING_TYPE_LABELS) as [
    Booking['type'],
    string,
  ][];
  protected readonly minDate = new Date().toISOString().slice(0, 16);

  protected readonly form = this.fb.group({
    type: this.fb.control<Booking['type']>('check-in-call'),
    startsAt: this.fb.control('', [Validators.required]),
    notes: this.fb.control('', [Validators.maxLength(300)]),
  });

  protected request(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const profile = this.portal.profile();
    const booking: Booking = {
      id: newId('b'),
      clientId: this.portal.userId(),
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      type: v.type,
      startsAt: new Date(v.startsAt).toISOString(),
      durationMinutes: DEFAULT_DURATION_MINUTES,
      location: v.type === 'session' ? 'In person' : 'Video call',
      status: 'requested',
      notes: v.notes.trim() || undefined,
    };
    this.saving.set(true);
    this.store
      .save(booking, true)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Appointment requested.');
          this.form.reset({ type: 'check-in-call', startsAt: '', notes: '' });
        },
        error: (e: Error) => this.toast.error(e.message),
      });
  }
}
