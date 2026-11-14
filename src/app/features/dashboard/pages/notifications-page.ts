import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationStore } from '../../../core/data-access/portal.stores';
import { ClientNotification } from '../../../core/models';
import { ClientPortal } from '../client-portal.service';

@Component({
  selector: 'app-notifications-page',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head page-head--row">
      <div>
        <p class="eyebrow">Notifications</p>
        <h1>Updates from your coach</h1>
      </div>
      @if (portal.unreadCount()) {
        <button type="button" class="btn btn--sm" (click)="markAll()">Mark all as read</button>
      }
    </header>
    @if (portal.notifications().length) {
      <ul class="list">
        @for (n of portal.notifications(); track n.id) {
          <li class="card" [class.card--featured]="!n.read">
            <div class="list-item">
              <strong>{{ n.title }}</strong>
              <time class="text-small text-muted" [attr.datetime]="n.createdAt">{{
                n.createdAt | date: 'medium'
              }}</time>
            </div>
            <p class="text-small">{{ n.body }}</p>
            @if (!n.read) {
              <button type="button" class="btn btn--ghost btn--sm" (click)="markRead(n)">
                Mark as read
              </button>
            }
          </li>
        }
      </ul>
    } @else {
      <div class="card empty"><p>You’re all caught up.</p></div>
    }
  `,
  styleUrl: './dashboard-pages.scss',
})
export class NotificationsPage {
  private readonly store = inject(NotificationStore);
  protected readonly portal = inject(ClientPortal);

  protected markRead(n: ClientNotification): void {
    this.store.patch(n.id, { read: true }).subscribe();
  }

  protected markAll(): void {
    this.portal
      .notifications()
      .filter((n) => !n.read)
      .forEach((n) => this.markRead(n));
  }
}
