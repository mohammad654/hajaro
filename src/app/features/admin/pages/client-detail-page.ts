import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import { PackageStore } from '../../../core/data-access/package.store';
import { ProgramStore } from '../../../core/data-access/program.store';
import {
  CheckInStore,
  ClientStore,
  MeasurementStore,
  SessionStore,
} from '../../../core/data-access/portal.stores';
import { ClientProfile, ClientStatus } from '../../../core/models';
import { ToastService } from '../../../core/services/toast.service';
import { TrendChart } from '../../../shared/ui/trend-chart';
import { NotFoundContent } from '../../not-found/not-found-content';
import { SessionHistory } from '../../planner/session-history';
import {
  DayGroup,
  ScheduleEditor,
  buildScheduleArray,
  readSchedule,
} from '../forms/schedule-editor';
import { SchemaFields } from '../forms/schema-fields';
import { buildSchemaGroup, readSchemaGroup } from '../forms/schema-form';
import { findResource } from '../resources/resource.registry';
import { CheckInReview, NotifyClient } from './client-sections';

const STATUSES: readonly ClientStatus[] = ['onboarding', 'active', 'paused', 'archived'];

@Component({
  selector: 'app-client-detail-page',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    SchemaFields,
    ScheduleEditor,
    TrendChart,
    SessionHistory,
    NotFoundContent,
    CheckInReview,
    NotifyClient,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './client-detail-page.html',
  styleUrl: '../../dashboard/pages/dashboard-pages.scss',
  styles: `
    .back {
      display: inline-flex;
      margin-bottom: var(--sp-3);
    }
    .block {
      margin-bottom: var(--sp-5);
      scroll-margin-top: var(--sp-5);
    }
  `,
})
export class ClientDetailPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly clients = inject(ClientStore);
  private readonly checkInStore = inject(CheckInStore);
  private readonly measurementStore = inject(MeasurementStore);
  private readonly sessionStore = inject(SessionStore);
  protected readonly programs = inject(ProgramStore);
  protected readonly packages = inject(PackageStore);

  readonly id = input.required<string>();

  protected readonly statuses = STATUSES;
  protected readonly saving = signal(false);
  protected readonly isNew = computed(() => this.id() === 'new');
  protected readonly client = computed(() => this.clients.get(this.id()));

  // ---- New client (simple schema form) ----
  private readonly clientResource = findResource('clients')!;
  protected readonly createFields = this.clientResource.fields;
  protected readonly createForm = buildSchemaGroup(this.createFields, this.clientResource.blank());

  // ---- Existing client ----
  protected readonly profileForm = this.fb.group({
    status: this.fb.control<ClientStatus>('onboarding'),
    packageId: this.fb.control(''),
    goal: this.fb.control('', [Validators.required, Validators.maxLength(160)]),
    assignedProgramId: this.fb.control(''),
    coachNotes: this.fb.control('', [Validators.maxLength(2000)]),
  });

  protected readonly nutritionForm = this.fb.group({
    calories: this.fb.control(0, [Validators.required, Validators.min(800), Validators.max(8000)]),
    proteinG: this.fb.control(0, [Validators.required, Validators.min(0), Validators.max(500)]),
    carbsG: this.fb.control(0, [Validators.required, Validators.min(0), Validators.max(1200)]),
    fatG: this.fb.control(0, [Validators.required, Validators.min(0), Validators.max(400)]),
    waterL: this.fb.control(3, [Validators.required, Validators.min(0), Validators.max(10)]),
    notes: this.fb.control('', [Validators.maxLength(500)]),
  });

  /** Present only when the coach has customised this client's schedule. */
  protected readonly scheduleForm = signal<FormArray<DayGroup> | null>(null);

  protected readonly checkIns = computed(() => this.checkInStore.forClient(this.id()));
  protected readonly measurements = computed(() => this.measurementStore.forClient(this.id()));
  protected readonly sessions = computed(() => this.sessionStore.forOwner(this.id()));
  protected readonly weightTrend = computed(() =>
    [...this.measurements()].reverse().map((m) => ({ label: m.date, value: m.weightKg })),
  );
  private readonly assignedProgramId = toSignal(
    this.profileForm.controls.assignedProgramId.valueChanges,
    { initialValue: '' },
  );
  protected readonly assignedProgram = computed(() => this.programs.get(this.assignedProgramId()));

  constructor() {
    // Populate forms whenever a different client record is loaded.
    effect(() => {
      const client = this.client();
      if (!client) return;
      untracked(() => this.populate(client));
    });
  }

  protected create(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    const client = this.clientResource.fromForm(
      readSchemaGroup(this.createFields, this.createForm),
      undefined,
    ) as ClientProfile;
    this.run(
      this.clients.save(client, true),
      'Client created.',
      () => void this.router.navigate(['/admin/clients', client.id]),
    );
  }

  protected saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const v = this.profileForm.getRawValue();
    this.patch(
      {
        status: v.status,
        packageId: v.packageId || undefined,
        goal: v.goal.trim(),
        assignedProgramId: v.assignedProgramId || undefined,
        coachNotes: v.coachNotes.trim() || undefined,
      },
      'Client profile saved.',
    );
  }

  protected saveNutrition(): void {
    if (this.nutritionForm.invalid) {
      this.nutritionForm.markAllAsTouched();
      return;
    }
    const v = this.nutritionForm.getRawValue();
    this.patch(
      { nutrition: { ...v, notes: v.notes.trim() || undefined } },
      'Nutrition targets updated.',
    );
  }

  protected customiseSchedule(): void {
    const program = this.assignedProgram();
    if (!program) {
      this.toast.info('Assign a program first, then customise it.');
      return;
    }
    this.scheduleForm.set(buildScheduleArray(program.schedule));
  }

  protected saveSchedule(): void {
    const form = this.scheduleForm();
    if (!form) return;
    if (form.invalid) {
      form.markAllAsTouched();
      this.toast.error('Select an exercise for every row.');
      return;
    }
    this.patch({ customSchedule: readSchedule(form) }, 'Individual plan saved.');
  }

  protected revertSchedule(): void {
    this.scheduleForm.set(null);
    this.patch({ customSchedule: undefined }, 'Plan reverted to the program template.');
  }

  private populate(client: ClientProfile): void {
    this.profileForm.reset({
      status: client.status,
      packageId: client.packageId ?? '',
      goal: client.goal,
      assignedProgramId: client.assignedProgramId ?? '',
      coachNotes: client.coachNotes ?? '',
    });
    const n = client.nutrition;
    this.nutritionForm.reset({
      calories: n?.calories ?? 2500,
      proteinG: n?.proteinG ?? 160,
      carbsG: n?.carbsG ?? 280,
      fatG: n?.fatG ?? 75,
      waterL: n?.waterL ?? 3,
      notes: n?.notes ?? '',
    });
    this.scheduleForm.set(client.customSchedule ? buildScheduleArray(client.customSchedule) : null);
  }

  private patch(changes: Partial<ClientProfile>, message: string): void {
    this.run(this.clients.patch(this.id(), changes), message);
  }

  private run<T>(request: Observable<T>, message: string, after?: () => void): void {
    this.saving.set(true);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.toast.success(message);
        after?.();
      },
      error: (e: Error) => this.toast.error(e.message),
    });
  }
}
