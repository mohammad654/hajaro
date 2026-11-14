import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { PackageStore } from '../../core/data-access/package.store';
import { ProgramStore } from '../../core/data-access/program.store';
import {
  BookingStore,
  CheckInStore,
  ClientStore,
  MeasurementStore,
  NotificationStore,
  ProgressPhotoStore,
} from '../../core/data-access/portal.stores';
import { WorkoutDay } from '../../core/models';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Facade for the signed-in client's data. Every query is scoped to the authenticated user's id,
 * so one client can never see another client's information through the UI.
 */
@Injectable({ providedIn: 'root' })
export class ClientPortal {
  private readonly auth = inject(AuthService);
  private readonly clients = inject(ClientStore);
  private readonly programs = inject(ProgramStore);
  private readonly packages = inject(PackageStore);
  private readonly measurementStore = inject(MeasurementStore);
  private readonly photoStore = inject(ProgressPhotoStore);
  private readonly checkInStore = inject(CheckInStore);
  private readonly notificationStore = inject(NotificationStore);
  private readonly bookingStore = inject(BookingStore);

  readonly userId = computed(() => this.auth.user()?.id ?? '');
  readonly profile = computed(() => this.clients.get(this.userId()));
  readonly package = computed(() => this.packages.get(this.profile()?.packageId));
  readonly program = computed(() => this.programs.get(this.profile()?.assignedProgramId));

  /** Coach-customised schedule takes precedence over the program template. */
  readonly schedule = computed<readonly WorkoutDay[]>(
    () => this.profile()?.customSchedule ?? this.program()?.schedule ?? [],
  );

  readonly today = computed<WorkoutDay | undefined>(() => {
    const schedule = this.schedule();
    if (!schedule.length) return undefined;
    const dayIndex = new Date().getDay();
    const byName = schedule.find((d) => d.label.toLowerCase() === WEEKDAYS[dayIndex].toLowerCase());
    // Schedules are Monday-first; fall back to positional mapping.
    return byName ?? schedule[((dayIndex + 6) % 7) % schedule.length];
  });

  readonly measurements = computed(() => this.measurementStore.forClient(this.userId()));
  readonly photos = computed(() => this.photoStore.forClient(this.userId()));
  readonly checkIns = computed(() => this.checkInStore.forClient(this.userId()));
  readonly notifications = computed(() => this.notificationStore.forClient(this.userId()));
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);
  readonly appointments = computed(() => this.bookingStore.forClient(this.userId()));
}
