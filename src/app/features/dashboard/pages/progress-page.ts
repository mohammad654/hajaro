import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { newId } from '../../../core/api/entity-repository';
import { MeasurementStore, ProgressPhotoStore } from '../../../core/data-access/portal.stores';
import { BodyMeasurement, ProgressPhoto } from '../../../core/models';
import { ToastService } from '../../../core/services/toast.service';
import { FieldError } from '../../../shared/forms/field-error';
import { downscaleImage } from '../../../shared/forms/image-downscale';
import { Icon } from '../../../shared/ui/icon/icon';
import { TrendChart } from '../../../shared/ui/trend-chart';
import { ClientPortal } from '../client-portal.service';

const optionalMeasure = (max: number) =>
  new FormControl<number | null>(null, [Validators.min(0), Validators.max(max)]);

@Component({
  selector: 'app-progress-page',
  imports: [DatePipe, ReactiveFormsModule, FieldError, Icon, TrendChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress-page.html',
  styleUrl: './dashboard-pages.scss',
  styles: `
    .photos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: var(--sp-3);
      list-style: none;
      padding: 0;
      margin: var(--sp-4) 0 0;
    }
    .photo {
      position: relative;
      margin: 0;
    }
    .photo img {
      width: 100%;
      aspect-ratio: 3 / 4;
      object-fit: cover;
      border-radius: var(--radius);
    }
    .photo figcaption {
      font-size: var(--fs-xs);
      color: var(--c-text-subtle);
      margin-top: var(--sp-1);
    }
    .photo button {
      position: absolute;
      top: 6px;
      right: 6px;
      background: rgb(0 0 0 / 60%);
    }
    .upload {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-3);
      align-items: end;
    }
  `,
})
export class ProgressPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly measurementsStore = inject(MeasurementStore);
  private readonly photoStore = inject(ProgressPhotoStore);
  private readonly toast = inject(ToastService);
  protected readonly portal = inject(ClientPortal);

  protected readonly saving = signal(false);
  protected readonly uploading = signal(false);
  protected readonly photoPose = signal<ProgressPhoto['pose']>('front');
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected readonly form = this.fb.group({
    date: this.fb.control(this.today, [Validators.required]),
    weightKg: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(30),
      Validators.max(300),
    ]),
    bodyFatPct: optionalMeasure(70),
    waistCm: optionalMeasure(250),
    chestCm: optionalMeasure(250),
    armCm: optionalMeasure(100),
    thighCm: optionalMeasure(150),
  });

  protected readonly weightTrend = computed(() =>
    [...this.portal.measurements()].reverse().map((m) => ({ label: m.date, value: m.weightKg })),
  );
  protected readonly waistTrend = computed(() =>
    [...this.portal.measurements()]
      .reverse()
      .filter((m) => m.waistCm)
      .map((m) => ({ label: m.date, value: m.waistCm! })),
  );

  protected addMeasurement(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const optional = (value: number | null) => (value === null ? undefined : value);
    const measurement: BodyMeasurement = {
      id: newId('m'),
      clientId: this.portal.userId(),
      date: v.date,
      weightKg: v.weightKg!,
      bodyFatPct: optional(v.bodyFatPct),
      waistCm: optional(v.waistCm),
      chestCm: optional(v.chestCm),
      armCm: optional(v.armCm),
      thighCm: optional(v.thighCm),
    };
    this.saving.set(true);
    this.measurementsStore
      .save(measurement, true)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Measurements saved.');
          this.form.reset({ date: this.today });
        },
        error: (e: Error) => this.toast.error(e.message),
      });
  }

  protected deleteMeasurement(m: BodyMeasurement): void {
    this.measurementsStore.remove(m.id).subscribe(() => this.toast.info('Entry deleted.'));
  }

  protected async uploadPhoto(event: Event): Promise<void> {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = '';
    if (!file) return;
    this.uploading.set(true);
    try {
      const url = await downscaleImage(file);
      const photo: ProgressPhoto = {
        id: newId('photo'),
        clientId: this.portal.userId(),
        date: this.today,
        pose: this.photoPose(),
        url,
      };
      this.photoStore.save(photo, true).subscribe({
        next: () => this.toast.success('Progress photo added.'),
        error: (e: Error) => this.toast.error(e.message),
      });
    } catch (error) {
      this.toast.error(
        error instanceof Error ? error.message : 'The photo could not be processed.',
      );
    } finally {
      this.uploading.set(false);
    }
  }

  protected deletePhoto(photo: ProgressPhoto): void {
    this.photoStore.remove(photo.id).subscribe(() => this.toast.info('Photo deleted.'));
  }

  protected readPose(event: Event): ProgressPhoto['pose'] {
    return (event.target as HTMLSelectElement).value as ProgressPhoto['pose'];
  }
}
