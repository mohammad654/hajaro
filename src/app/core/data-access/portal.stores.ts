import { Injectable, computed } from '@angular/core';
import {
  DEMO_BOOKINGS,
  DEMO_CHECK_INS,
  DEMO_CLIENTS,
  DEMO_INQUIRIES,
  DEMO_MEASUREMENTS,
  DEMO_NOTIFICATIONS,
} from '../data/portal-demo.data';
import {
  BodyMeasurement,
  Booking,
  CheckIn,
  ClientNotification,
  ClientProfile,
  Inquiry,
  ProgressPhoto,
  WorkoutRoutine,
  WorkoutSession,
} from '../models';
import { EntityStore } from './entity-store';

/**
 * Stores for private client data. With a real backend, the API must scope every
 * collection to the authenticated user (clients) or allow full access (admin role).
 * The `forClient` helpers additionally filter on the client side as a defence in depth.
 */
const byDateDesc = <T extends { date: string }>(a: T, b: T) => b.date.localeCompare(a.date);

@Injectable({ providedIn: 'root' })
export class ClientStore extends EntityStore<ClientProfile> {
  constructor() {
    super('clients', DEMO_CLIENTS);
  }
}

@Injectable({ providedIn: 'root' })
export class MeasurementStore extends EntityStore<BodyMeasurement> {
  constructor() {
    super('measurements', DEMO_MEASUREMENTS);
  }

  forClient(clientId: string): BodyMeasurement[] {
    return this.all()
      .filter((m) => m.clientId === clientId)
      .slice()
      .sort(byDateDesc);
  }
}

@Injectable({ providedIn: 'root' })
export class ProgressPhotoStore extends EntityStore<ProgressPhoto> {
  constructor() {
    super('progress-photos', []);
  }

  forClient(clientId: string): ProgressPhoto[] {
    return this.all()
      .filter((p) => p.clientId === clientId)
      .slice()
      .sort(byDateDesc);
  }
}

@Injectable({ providedIn: 'root' })
export class CheckInStore extends EntityStore<CheckIn> {
  readonly awaitingFeedback = computed(() => this.all().filter((c) => !c.coachFeedback));

  constructor() {
    super('check-ins', DEMO_CHECK_INS);
  }

  forClient(clientId: string): CheckIn[] {
    return this.all()
      .filter((c) => c.clientId === clientId)
      .slice()
      .sort(byDateDesc);
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationStore extends EntityStore<ClientNotification> {
  constructor() {
    super('notifications', DEMO_NOTIFICATIONS);
  }

  forClient(clientId: string): ClientNotification[] {
    return this.all()
      .filter((n) => n.clientId === clientId)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

@Injectable({ providedIn: 'root' })
export class BookingStore extends EntityStore<Booking> {
  readonly upcoming = computed(() =>
    this.all()
      .filter((b) => b.status !== 'cancelled' && b.status !== 'completed')
      .slice()
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
  );

  constructor() {
    super('bookings', DEMO_BOOKINGS);
  }

  forClient(clientId: string): Booking[] {
    return this.upcoming().filter((b) => b.clientId === clientId);
  }
}

@Injectable({ providedIn: 'root' })
export class InquiryStore extends EntityStore<Inquiry> {
  readonly open = computed(() =>
    this.all().filter((i) => i.status === 'new' || i.status === 'contacted'),
  );

  constructor() {
    super('inquiries', DEMO_INQUIRIES);
  }
}

@Injectable({ providedIn: 'root' })
export class RoutineStore extends EntityStore<WorkoutRoutine> {
  constructor() {
    super('routines', []);
  }

  forOwner(ownerId: string): WorkoutRoutine[] {
    return this.all()
      .filter((r) => r.ownerId === ownerId)
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

@Injectable({ providedIn: 'root' })
export class SessionStore extends EntityStore<WorkoutSession> {
  constructor() {
    super('workout-sessions', []);
  }

  forOwner(ownerId: string): WorkoutSession[] {
    return this.all()
      .filter((s) => s.ownerId === ownerId)
      .slice()
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }
}
