import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { newId } from '../../../core/api/entity-repository';
import { CheckInStore } from '../../../core/data-access/portal.stores';
import { CheckIn } from '../../../core/models';
import { ToastService } from '../../../core/services/toast.service';
import { FieldError } from '../../../shared/forms/field-error';
import { ClientPortal } from '../client-portal.service';

@Component({
  selector: 'app-check-ins-page',
  imports: [DatePipe, ReactiveFormsModule, FieldError],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <p class="eyebrow">Weekly check-in</p>
      <h1>How was your week?</h1>
      <p class="text-muted">Honest check-ins help your coach make the right adjustments.</p>
    </header>

    <section class="card form-card" aria-labelledby="checkin-form">
      <h2 id="checkin-form" class="h-sm">New check-in</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="form-grid">
          <div class="field">
            <label for="ci-weight">Average weight this week (kg) *</label>
            <input
              id="ci-weight"
              class="input"
              type="number"
              step="0.1"
              formControlName="weightKg"
              aria-describedby="ci-weight-err"
            />
            <app-field-error [control]="form.controls.weightKg" id="ci-weight-err" label="Weight" />
          </div>
          <div class="field">
            <label for="ci-sleep">Average sleep (hours) *</label>
            <input
              id="ci-sleep"
              class="input"
              type="number"
              step="0.5"
              formControlName="sleepHours"
              aria-describedby="ci-sleep-err"
            />
            <app-field-error [control]="form.controls.sleepHours" id="ci-sleep-err" label="Sleep" />
          </div>
          <div class="field">
            <label for="ci-energy">Energy (1–5): {{ form.controls.energy.value }}</label>
            <input id="ci-energy" type="range" min="1" max="5" step="1" formControlName="energy" />
          </div>
          <div class="field">
            <label for="ci-training"
              >Training adherence: {{ form.controls.trainingAdherence.value }}%</label
            >
            <input
              id="ci-training"
              type="range"
              min="0"
              max="100"
              step="5"
              formControlName="trainingAdherence"
            />
          </div>
          <div class="field">
            <label for="ci-nutrition"
              >Nutrition adherence: {{ form.controls.nutritionAdherence.value }}%</label
            >
            <input
              id="ci-nutrition"
              type="range"
              min="0"
              max="100"
              step="5"
              formControlName="nutritionAdherence"
            />
          </div>
          <div class="field span-2">
            <label for="ci-notes">Notes for your coach *</label>
            <textarea
              id="ci-notes"
              class="textarea"
              formControlName="notes"
              maxlength="1500"
              placeholder="Wins, struggles, how training felt, hunger, stress, anything unusual…"
              aria-describedby="ci-notes-err"
            ></textarea>
            <app-field-error [control]="form.controls.notes" id="ci-notes-err" label="Notes" />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn--primary" [disabled]="saving()">
            @if (saving()) {
              <span class="spinner" aria-hidden="true"></span>
            }
            Submit check-in
          </button>
        </div>
      </form>
    </section>

    <section aria-labelledby="ci-history">
      <h2 id="ci-history">Previous check-ins</h2>
      @if (portal.checkIns().length) {
        <ul class="list">
          @for (c of portal.checkIns(); track c.id) {
            <li class="card">
              <div class="list-item">
                <strong>{{ c.date | date: 'fullDate' }}</strong>
                <span class="badge" [class.badge--success]="c.coachFeedback">{{
                  c.coachFeedback ? 'Reviewed' : 'Awaiting feedback'
                }}</span>
              </div>
              <p class="text-small text-muted">
                {{ c.weightKg }} kg · {{ c.sleepHours }} h sleep · energy {{ c.energy }}/5 ·
                training {{ c.trainingAdherence }}% · nutrition {{ c.nutritionAdherence }}%
              </p>
              <p class="text-small">{{ c.notes }}</p>
              @if (c.coachFeedback) {
                <p class="feedback"><strong>Coach:</strong> {{ c.coachFeedback }}</p>
              }
            </li>
          }
        </ul>
      } @else {
        <p class="text-muted">No check-ins yet.</p>
      }
    </section>
  `,
  styleUrl: './dashboard-pages.scss',
  styles: `
    input[type='range'] {
      accent-color: var(--c-accent);
      width: 100%;
    }
  `,
})
export class CheckInsPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(CheckInStore);
  private readonly toast = inject(ToastService);
  protected readonly portal = inject(ClientPortal);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.group({
    weightKg: this.fb.control<number | null>(this.portal.checkIns()[0]?.weightKg ?? null, [
      Validators.required,
      Validators.min(30),
      Validators.max(300),
    ]),
    sleepHours: this.fb.control(7, [Validators.required, Validators.min(0), Validators.max(16)]),
    energy: this.fb.control(3),
    trainingAdherence: this.fb.control(100),
    nutritionAdherence: this.fb.control(90),
    notes: this.fb.control('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(1500),
    ]),
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const checkIn: CheckIn = {
      id: newId('ci'),
      clientId: this.portal.userId(),
      date: new Date().toISOString().slice(0, 10),
      weightKg: v.weightKg!,
      sleepHours: v.sleepHours,
      energy: v.energy,
      trainingAdherence: v.trainingAdherence,
      nutritionAdherence: v.nutritionAdherence,
      notes: v.notes.trim(),
    };
    this.saving.set(true);
    this.store
      .save(checkIn, true)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Check-in submitted. Your coach will review it soon.');
          this.form.controls.notes.reset('');
        },
        error: (e: Error) => this.toast.error(e.message),
      });
  }
}
