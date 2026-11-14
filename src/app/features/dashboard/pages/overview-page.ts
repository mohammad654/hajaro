import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon';
import { WorkoutDayTable } from '../../programs/workout-day-table';
import { ClientPortal } from '../client-portal.service';

@Component({
  selector: 'app-overview-page',
  imports: [DatePipe, RouterLink, Icon, WorkoutDayTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <p class="eyebrow">Welcome back</p>
      <h1>{{ firstName() }}</h1>
      @if (portal.profile(); as p) {
        <p class="text-muted">Goal: {{ p.goal }}</p>
      }
    </header>

    <div class="grid grid--4 stats">
      <div class="card stat">
        <span class="stat__label">Program</span>
        <span class="stat__text">{{ portal.program()?.name ?? 'Awaiting assignment' }}</span>
      </div>
      <div class="card stat">
        <span class="stat__label">Package</span>
        <span class="stat__text">{{ portal.package()?.name ?? '—' }}</span>
      </div>
      <div class="card stat">
        <span class="stat__label">Latest weight</span>
        <span class="stat__value">{{ latestWeight() ?? '—' }}<small> kg</small></span>
      </div>
      <a class="card stat stat--link" routerLink="/dashboard/notifications">
        <span class="stat__label">Unread notifications</span>
        <span class="stat__value">{{ portal.unreadCount() }}</span>
      </a>
    </div>

    <div class="split split--sidebar layout">
      <section class="card" aria-labelledby="today-title">
        <div class="section-row">
          <h2 id="today-title">Today’s workout</h2>
          <a routerLink="/dashboard/training" class="link-arrow">Full week</a>
        </div>
        @if (portal.today(); as today) {
          @if (today.isRestDay) {
            <p class="text-muted">Rest day — {{ today.focus }}</p>
          } @else {
            <p class="text-muted">{{ today.label }} · {{ today.focus }}</p>
            <app-workout-day-table [day]="today" />
            <a
              class="btn btn--primary today-cta"
              routerLink="/dashboard/training"
              [queryParams]="{ day: today.id }"
            >
              <app-icon name="play" [size]="16" /> Start workout
            </a>
          }
        } @else {
          <p class="text-muted">
            Your coach is preparing your program. You will be notified when it is ready.
          </p>
        }
      </section>

      <aside class="stack">
        <section class="card" aria-labelledby="appt-title">
          <h2 id="appt-title" class="h-sm">Next appointment</h2>
          @if (portal.appointments()[0]; as next) {
            <p>
              <strong>{{ next.startsAt | date: 'EEEE d MMM, HH:mm' }}</strong>
            </p>
            <p class="text-small text-muted">
              {{ next.durationMinutes }} min · {{ next.location }} · {{ next.status }}
            </p>
          } @else {
            <p class="text-small text-muted">No upcoming appointments.</p>
          }
          <a routerLink="/dashboard/appointments" class="link-arrow">Appointments</a>
        </section>

        <section class="card" aria-labelledby="nutri-title">
          <h2 id="nutri-title" class="h-sm">Nutrition targets</h2>
          @if (portal.profile()?.nutrition; as n) {
            <p class="macro-line">
              <strong>{{ n.calories }}</strong> kcal · P {{ n.proteinG }} g · C {{ n.carbsG }} g · F
              {{ n.fatG }} g
            </p>
          } @else {
            <p class="text-small text-muted">Targets will appear once set by your coach.</p>
          }
          <a routerLink="/dashboard/nutrition" class="link-arrow">Details</a>
        </section>

        <section class="card" aria-labelledby="feedback-title">
          <h2 id="feedback-title" class="h-sm">Latest coach feedback</h2>
          @if (latestFeedback(); as c) {
            <p class="text-small">“{{ c.coachFeedback }}”</p>
            <p class="text-small text-muted">
              On your check-in from {{ c.date | date: 'mediumDate' }}
            </p>
          } @else {
            <p class="text-small text-muted">Submit a check-in to receive feedback.</p>
          }
          <a routerLink="/dashboard/check-ins" class="link-arrow">Check-ins</a>
        </section>
      </aside>
    </div>
  `,
  styleUrl: './dashboard-pages.scss',
})
export class OverviewPage {
  protected readonly portal = inject(ClientPortal);
  protected readonly firstName = computed(
    () => (this.portal.profile()?.name ?? 'Athlete').split(' ')[0],
  );
  protected readonly latestWeight = computed<number | undefined>(
    () => this.portal.measurements()[0]?.weightKg ?? this.portal.checkIns()[0]?.weightKg,
  );
  protected readonly latestFeedback = computed(() =>
    this.portal.checkIns().find((c) => c.coachFeedback),
  );
}
