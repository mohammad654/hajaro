import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleStore } from '../../../core/data-access/article.store';
import { ExerciseStore } from '../../../core/data-access/exercise.store';
import { ProgramStore } from '../../../core/data-access/program.store';
import {
  BookingStore,
  CheckInStore,
  ClientStore,
  InquiryStore,
} from '../../../core/data-access/portal.stores';
import { BOOKING_TYPE_LABELS } from '../../../core/models';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: 'app-admin-overview-page',
  imports: [DatePipe, RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <p class="eyebrow">Coach admin</p>
      <h1>Overview</h1>
    </header>

    <div class="grid grid--4 stats">
      @for (s of stats(); track s.label) {
        <a class="card stat stat--link" [routerLink]="s.link">
          <span class="stat__label"><app-icon [name]="s.icon" [size]="14" /> {{ s.label }}</span>
          <span class="stat__value">{{ s.value }}</span>
        </a>
      }
    </div>

    <div class="grid grid--2">
      <section class="card" aria-labelledby="new-inq">
        <div class="section-row">
          <h2 id="new-inq" class="h-sm">New consultation requests</h2>
          <a routerLink="/admin/inquiries" class="link-arrow">All</a>
        </div>
        @if (inquiries.open().length) {
          <ul class="list">
            @for (i of inquiries.open().slice(0, 5); track i.id) {
              <li class="list-item">
                <div>
                  <strong>{{ i.name }}</strong>
                  <p class="text-small text-muted">
                    {{ i.goals.join(', ') }} · {{ i.createdAt | date: 'mediumDate' }}
                  </p>
                </div>
                <span class="badge" [class.badge--accent]="i.status === 'new'">{{ i.status }}</span>
              </li>
            }
          </ul>
        } @else {
          <p class="text-muted text-small">No open requests.</p>
        }
      </section>

      <section class="card" aria-labelledby="awaiting">
        <div class="section-row">
          <h2 id="awaiting" class="h-sm">Check-ins awaiting feedback</h2>
        </div>
        @if (awaiting().length) {
          <ul class="list">
            @for (row of awaiting(); track row.checkIn.id) {
              <li class="list-item">
                <div>
                  <strong>{{ row.client?.name ?? row.checkIn.clientId }}</strong>
                  <p class="text-small text-muted">
                    {{ row.checkIn.date | date: 'mediumDate' }} · {{ row.checkIn.weightKg }} kg
                  </p>
                </div>
                <a
                  class="btn btn--sm"
                  [routerLink]="['/admin/clients', row.checkIn.clientId]"
                  fragment="check-ins"
                  >Review</a
                >
              </li>
            }
          </ul>
        } @else {
          <p class="text-muted text-small">All check-ins reviewed.</p>
        }
      </section>

      <section class="card" aria-labelledby="upcoming">
        <div class="section-row">
          <h2 id="upcoming" class="h-sm">Upcoming bookings</h2>
          <a routerLink="/admin/bookings" class="link-arrow">All</a>
        </div>
        @if (bookings.upcoming().length) {
          <ul class="list">
            @for (b of bookings.upcoming().slice(0, 5); track b.id) {
              <li class="list-item">
                <div>
                  <strong>{{ b.name }}</strong>
                  <p class="text-small text-muted">
                    {{ typeLabels[b.type] }} · {{ b.startsAt | date: 'EEE d MMM, HH:mm' }}
                  </p>
                </div>
                <span
                  class="badge"
                  [class.badge--success]="b.status === 'confirmed'"
                  [class.badge--accent]="b.status === 'requested'"
                  >{{ b.status }}</span
                >
              </li>
            }
          </ul>
        } @else {
          <p class="text-muted text-small">No upcoming bookings.</p>
        }
      </section>

      <section class="card" aria-labelledby="quick">
        <h2 id="quick" class="h-sm">Quick actions</h2>
        <div class="cluster">
          <a class="btn btn--sm" routerLink="/admin/programs/new"
            ><app-icon name="plus" [size]="16" /> New workout chart</a
          >
          <a class="btn btn--sm" routerLink="/admin/articles/new"
            ><app-icon name="plus" [size]="16" /> New article</a
          >
          <a class="btn btn--sm" routerLink="/admin/exercises/new"
            ><app-icon name="plus" [size]="16" /> New exercise</a
          >
          <a class="btn btn--sm" routerLink="/admin/clients/new"
            ><app-icon name="plus" [size]="16" /> New client</a
          >
          <a class="btn btn--sm" routerLink="/admin/content"
            ><app-icon name="settings" [size]="16" /> Edit site content</a
          >
        </div>
      </section>
    </div>
  `,
  styleUrl: '../../dashboard/pages/dashboard-pages.scss',
})
export class AdminOverviewPage {
  protected readonly inquiries = inject(InquiryStore);
  protected readonly bookings = inject(BookingStore);
  private readonly clients = inject(ClientStore);
  private readonly checkIns = inject(CheckInStore);
  private readonly programs = inject(ProgramStore);
  private readonly exercises = inject(ExerciseStore);
  private readonly articles = inject(ArticleStore);
  protected readonly typeLabels = BOOKING_TYPE_LABELS;

  protected readonly awaiting = computed(() =>
    this.checkIns
      .awaitingFeedback()
      .slice(0, 5)
      .map((checkIn) => ({ checkIn, client: this.clients.get(checkIn.clientId) })),
  );

  protected readonly stats = computed(() => [
    {
      label: 'Active clients',
      value: this.clients.all().filter((c) => c.status === 'active').length,
      icon: 'users',
      link: '/admin/clients',
    },
    {
      label: 'Open requests',
      value: this.inquiries.open().length,
      icon: 'mail',
      link: '/admin/inquiries',
    },
    {
      label: 'Upcoming bookings',
      value: this.bookings.upcoming().length,
      icon: 'calendar',
      link: '/admin/bookings',
    },
    {
      label: 'Check-ins to review',
      value: this.checkIns.awaitingFeedback().length,
      icon: 'message',
      link: '/admin/clients',
    },
    {
      label: 'Programs',
      value: this.programs.all().length,
      icon: 'layers',
      link: '/admin/programs',
    },
    {
      label: 'Exercises',
      value: this.exercises.all().length,
      icon: 'dumbbell',
      link: '/admin/exercises',
    },
    {
      label: 'Published articles',
      value: this.articles.published().length,
      icon: 'book',
      link: '/admin/articles',
    },
    {
      label: 'Draft articles',
      value: this.articles.all().filter((a) => !a.published).length,
      icon: 'edit',
      link: '/admin/articles',
    },
  ]);
}
