import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { newId } from '../../../core/api/entity-repository';
import { BookingStore, InquiryStore } from '../../../core/data-access/portal.stores';
import {
  COACHING_TYPE_LABELS,
  EXPERIENCE_LABELS,
  Inquiry,
  InquiryStatus,
} from '../../../core/models';
import { ToastService } from '../../../core/services/toast.service';
import { Icon } from '../../../shared/ui/icon/icon';
import { Paginator } from '../../../shared/ui/paginator';
import { createListState } from '../list-state';

const STATUSES: readonly InquiryStatus[] = ['new', 'contacted', 'booked', 'closed'];
const CONSULTATION_MINUTES = 20;

@Component({
  selector: 'app-inquiries-page',
  imports: [DatePipe, Icon, Paginator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <p class="eyebrow">Leads</p>
      <h1>Consultation requests</h1>
      <p class="text-muted">Enquiries from the contact form. Update the status as you follow up.</p>
    </header>

    <div class="toolbar" role="search">
      <label for="inq-search" class="visually-hidden">Search requests</label>
      <input
        id="inq-search"
        class="input"
        type="search"
        placeholder="Search name or email…"
        [value]="list.query()"
        (input)="list.query.set(readValue($event))"
      />
      <label for="inq-status" class="visually-hidden">Status</label>
      <select
        id="inq-status"
        class="select"
        [value]="list.filter()"
        (change)="list.filter.set(readValue($event))"
      >
        <option value="">All statuses</option>
        @for (s of statuses; track s) {
          <option [value]="s">{{ s }}</option>
        }
      </select>
    </div>

    @if (list.visible().length) {
      <ul class="list">
        @for (i of list.visible(); track i.id) {
          <li class="card">
            <details>
              <summary class="list-item">
                <div>
                  <strong>{{ i.name }}</strong>
                  <p class="text-small text-muted">
                    {{ i.email }} · {{ i.createdAt | date: 'medium' }}
                  </p>
                </div>
                <div class="cluster">
                  @if (i.wantsConsultation) {
                    <span class="badge badge--accent">Consultation</span>
                  }
                  <span class="badge" [class.badge--success]="i.status === 'booked'">{{
                    i.status
                  }}</span>
                </div>
              </summary>
              <dl class="details">
                <div>
                  <dt>Goals</dt>
                  <dd>{{ i.goals.join(', ') }}</dd>
                </div>
                <div>
                  <dt>Coaching type</dt>
                  <dd>{{ coachingTypes[i.coachingType] }}</dd>
                </div>
                <div>
                  <dt>Experience</dt>
                  <dd>{{ experience[i.experience] }}</dd>
                </div>
                @if (i.phone) {
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      <a [href]="'tel:' + i.phone">{{ i.phone }}</a>
                    </dd>
                  </div>
                }
                @if (i.preferredTime) {
                  <div>
                    <dt>Preferred time</dt>
                    <dd>{{ i.preferredTime }}</dd>
                  </div>
                }
                <div class="wide">
                  <dt>Message</dt>
                  <dd class="message">{{ i.message }}</dd>
                </div>
              </dl>
              <div class="cluster actions-row">
                <label class="visually-hidden" [for]="'st-' + i.id">Status</label>
                <select
                  [id]="'st-' + i.id"
                  class="select input--sm"
                  [value]="i.status"
                  (change)="setStatus(i, readValue($event))"
                >
                  @for (s of statuses; track s) {
                    <option [value]="s">{{ s }}</option>
                  }
                </select>
                <a class="btn btn--sm" [href]="'mailto:' + i.email"
                  ><app-icon name="mail" [size]="16" /> Reply</a
                >
                @if (i.wantsConsultation && i.status !== 'booked') {
                  <button type="button" class="btn btn--sm btn--primary" (click)="book(i)">
                    <app-icon name="calendar" [size]="16" /> Create booking
                  </button>
                }
                <button type="button" class="btn btn--ghost btn--sm" (click)="remove(i)">
                  <app-icon name="trash" [size]="16" /> Delete
                </button>
              </div>
            </details>
          </li>
        }
      </ul>
      <app-paginator
        [page]="list.page()"
        [pageSize]="list.pageSize"
        [total]="list.filtered().length"
        (pageChange)="list.page.set($event)"
      />
    } @else {
      <div class="card empty">
        <p>
          No consultation requests yet. They will appear here when visitors use the contact form.
        </p>
      </div>
    }
  `,
  styleUrl: '../../dashboard/pages/dashboard-pages.scss',
  styles: `
    summary {
      cursor: pointer;
      list-style: none;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary p {
      margin: 0;
    }
    .details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--sp-3);
      margin: var(--sp-4) 0;
      padding-top: var(--sp-4);
      border-top: 1px solid var(--c-border);
    }
    .details .wide {
      grid-column: 1 / -1;
    }
    dt {
      font-size: var(--fs-xs);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--c-text-subtle);
    }
    dd {
      margin: 0;
      font-size: var(--fs-sm);
    }
    .message {
      white-space: pre-line;
    }
    .actions-row .select {
      width: auto;
    }
  `,
})
export class InquiriesPage {
  private readonly store = inject(InquiryStore);
  private readonly bookings = inject(BookingStore);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly statuses = STATUSES;
  protected readonly coachingTypes = COACHING_TYPE_LABELS;
  protected readonly experience = EXPERIENCE_LABELS;
  protected readonly list = createListState(
    this.store.all,
    (i: Inquiry) => `${i.name} ${i.email}`,
    (i: Inquiry, status: string) => i.status === status,
  );

  protected readValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected setStatus(inquiry: Inquiry, status: string): void {
    this.store
      .patch(inquiry.id, { status: status as InquiryStatus })
      .subscribe(() => this.toast.success('Status updated.'));
  }

  /** Creates a draft booking from the request and opens it for scheduling. */
  protected book(inquiry: Inquiry): void {
    const id = newId('b');
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(18, 0, 0, 0);
    this.bookings
      .save(
        {
          id,
          name: inquiry.name,
          email: inquiry.email,
          type: 'consultation',
          startsAt: tomorrow.toISOString(),
          durationMinutes: CONSULTATION_MINUTES,
          location: 'Video call',
          status: 'requested',
          notes: inquiry.preferredTime ? `Preferred: ${inquiry.preferredTime}` : undefined,
        },
        true,
      )
      .subscribe(() => {
        this.store.patch(inquiry.id, { status: 'booked' }).subscribe();
        this.toast.success('Draft booking created — set the final time.');
        void this.router.navigate(['/admin/bookings', id]);
      });
  }

  protected remove(inquiry: Inquiry): void {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Delete the request from ${inquiry.name}?`)
    )
      return;
    this.store.remove(inquiry.id).subscribe(() => this.toast.info('Request deleted.'));
  }
}
