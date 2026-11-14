import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { newId } from '../../../core/api/entity-repository';
import { CheckInStore, NotificationStore } from '../../../core/data-access/portal.stores';
import { CheckIn } from '../../../core/models';
import { ToastService } from '../../../core/services/toast.service';
import { FieldError } from '../../../shared/forms/field-error';

/** Coach feedback on a single client check-in. */
@Component({
  selector: 'app-check-in-review',
  imports: [DatePipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card card--flat review">
      <div class="review__head">
        <strong>{{ checkIn().date | date: 'fullDate' }}</strong>
        <span
          class="badge"
          [class.badge--success]="checkIn().coachFeedback"
          [class.badge--accent]="!checkIn().coachFeedback"
        >
          {{ checkIn().coachFeedback ? 'Reviewed' : 'Awaiting feedback' }}
        </span>
      </div>
      <p class="text-small text-muted">
        {{ checkIn().weightKg }} kg · {{ checkIn().sleepHours }} h sleep · energy
        {{ checkIn().energy }}/5 · training {{ checkIn().trainingAdherence }}% · nutrition
        {{ checkIn().nutritionAdherence }}%
      </p>
      <p class="text-small">“{{ checkIn().notes }}”</p>
      <label class="visually-hidden" [for]="'fb-' + checkIn().id">Feedback</label>
      <textarea
        [id]="'fb-' + checkIn().id"
        class="textarea"
        rows="3"
        [formControl]="feedback"
        placeholder="Write feedback for your client…"
      ></textarea>
      <div class="form-actions">
        <button
          type="button"
          class="btn btn--sm btn--primary"
          (click)="send()"
          [disabled]="saving() || feedback.invalid"
        >
          {{ checkIn().coachFeedback ? 'Update feedback' : 'Send feedback' }}
        </button>
      </div>
    </article>
  `,
  styles: `
    .review {
      display: grid;
      gap: var(--sp-2);
    }
    .review__head {
      display: flex;
      justify-content: space-between;
      gap: var(--sp-3);
    }
    p {
      margin: 0;
    }
    .form-actions {
      margin-top: 0;
    }
  `,
})
export class CheckInReview implements OnInit {
  private readonly store = inject(CheckInStore);
  private readonly notifications = inject(NotificationStore);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly checkIn = input.required<CheckIn>();
  protected readonly saving = signal(false);
  protected readonly feedback = this.fb.control('', [
    Validators.required,
    Validators.maxLength(2000),
  ]);

  ngOnInit(): void {
    this.feedback.setValue(this.checkIn().coachFeedback ?? '');
  }

  protected send(): void {
    const checkIn = this.checkIn();
    const text = this.feedback.value.trim();
    if (!text) return;
    this.saving.set(true);
    this.store
      .patch(checkIn.id, { coachFeedback: text, feedbackAt: new Date().toISOString().slice(0, 10) })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Feedback sent.');
          this.notifications
            .save(
              {
                id: newId('n'),
                clientId: checkIn.clientId,
                title: 'New coach feedback',
                body: 'Your coach has reviewed your latest check-in.',
                createdAt: new Date().toISOString(),
                read: false,
              },
              true,
            )
            .subscribe();
        },
        error: (e: Error) => this.toast.error(e.message),
      });
  }
}

/** Sends an in-app notification to one client. */
@Component({
  selector: 'app-notify-client',
  imports: [ReactiveFormsModule, FieldError],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="send()" novalidate>
      <div class="form-grid">
        <div class="field span-2">
          <label for="n-title">Title *</label>
          <input
            id="n-title"
            class="input"
            formControlName="title"
            maxlength="80"
            aria-describedby="n-title-err"
          />
          <app-field-error [control]="form.controls.title" id="n-title-err" label="Title" />
        </div>
        <div class="field span-2">
          <label for="n-body">Message *</label>
          <textarea
            id="n-body"
            class="textarea"
            rows="3"
            formControlName="body"
            maxlength="500"
            aria-describedby="n-body-err"
          ></textarea>
          <app-field-error [control]="form.controls.body" id="n-body-err" label="Message" />
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn--primary btn--sm" [disabled]="saving()">
          Send notification
        </button>
      </div>
    </form>
  `,
})
export class NotifyClient {
  private readonly store = inject(NotificationStore);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly clientId = input.required<string>();
  protected readonly saving = signal(false);
  protected readonly form = this.fb.group({
    title: this.fb.control('', [Validators.required, Validators.maxLength(80)]),
    body: this.fb.control('', [Validators.required, Validators.maxLength(500)]),
  });

  protected send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.saving.set(true);
    this.store
      .save(
        {
          id: newId('n'),
          clientId: this.clientId(),
          title: v.title.trim(),
          body: v.body.trim(),
          createdAt: new Date().toISOString(),
          read: false,
        },
        true,
      )
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Notification sent.');
          this.form.reset();
        },
        error: (e: Error) => this.toast.error(e.message),
      });
  }
}
