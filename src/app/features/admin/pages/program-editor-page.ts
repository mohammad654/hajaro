import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProgramStore } from '../../../core/data-access/program.store';
import {
  DIFFICULTY_LABELS,
  DifficultyLevel,
  EQUIPMENT_LABELS,
  Equipment,
  PROGRAM_GOAL_LABELS,
  ProgramGoal,
  TRAINING_TYPE_LABELS,
  TrainingProgram,
  TrainingType,
} from '../../../core/models';
import { ToastService } from '../../../core/services/toast.service';
import { slugify } from '../../../shared/forms/validation-messages';
import { NotFoundContent } from '../../not-found/not-found-content';
import {
  DayGroup,
  ScheduleEditor,
  buildScheduleArray,
  readSchedule,
} from '../forms/schedule-editor';
import { SchemaFields } from '../forms/schema-fields';
import {
  FieldDef,
  bool,
  buildSchemaGroup,
  list,
  num,
  optNum,
  optionsFrom,
  readSchemaGroup,
  str,
} from '../forms/schema-form';

const PROGRAM_FIELDS: readonly FieldDef[] = [
  { key: 'name', label: 'Program name', type: 'text', required: true, maxLength: 80 },
  { key: 'slug', label: 'URL slug', type: 'slug', hint: 'Leave empty to generate from the name.' },
  { key: 'tagline', label: 'Tagline', type: 'text', required: true, maxLength: 140, wide: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true, rows: 4 },
  {
    key: 'level',
    label: 'Level',
    type: 'select',
    required: true,
    options: optionsFrom(DIFFICULTY_LABELS),
  },
  {
    key: 'goal',
    label: 'Goal',
    type: 'select',
    required: true,
    options: optionsFrom(PROGRAM_GOAL_LABELS),
  },
  {
    key: 'trainingType',
    label: 'Training type',
    type: 'select',
    required: true,
    options: optionsFrom(TRAINING_TYPE_LABELS),
  },
  {
    key: 'durationWeeks',
    label: 'Duration (weeks)',
    type: 'number',
    required: true,
    min: 1,
    max: 52,
  },
  {
    key: 'sessionMinutes',
    label: 'Session length (minutes)',
    type: 'text',
    required: true,
    maxLength: 20,
  },
  {
    key: 'price',
    label: 'Self-guided price (optional)',
    type: 'number',
    min: 0,
    hint: 'Leave empty for coaching-only programs.',
  },
  {
    key: 'equipment',
    label: 'Equipment',
    type: 'multiselect',
    options: optionsFrom(EQUIPMENT_LABELS),
  },
  { key: 'targetAudience', label: 'Target audience', type: 'lines' },
  { key: 'structure', label: 'Training structure', type: 'lines' },
  { key: 'warmUp', label: 'Warm-up instructions', type: 'lines' },
  { key: 'progression', label: 'Progression recommendations', type: 'lines' },
  { key: 'recovery', label: 'Recovery guidance', type: 'lines' },
  { key: 'featured', label: 'Feature on the homepage', type: 'checkbox' },
];

const DEFAULT_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
].map((label, i) => ({
  id: `d${i + 1}`,
  label,
  focus: i % 2 === 1 || i >= 5 ? 'Rest & recovery' : 'Full body',
  isRestDay: i % 2 === 1 || i >= 5,
  exercises: [],
}));

/** Workout chart builder: program details plus a fully editable weekly schedule. */
@Component({
  selector: 'app-program-editor-page',
  imports: [ReactiveFormsModule, RouterLink, SchemaFields, ScheduleEditor, NotFoundContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (forms(); as f) {
      <header class="page-head">
        <a routerLink="/admin/programs" class="link-arrow back">Back to programs</a>
        <h1>{{ isNew() ? 'New workout chart' : 'Edit ' + (existing()?.name ?? 'program') }}</h1>
      </header>
      <form [formGroup]="f.meta" (ngSubmit)="save(f.meta, f.schedule)" novalidate class="stack">
        <section class="card" aria-labelledby="details-title">
          <h2 id="details-title" class="h-sm">Program details</h2>
          <app-schema-fields [group]="f.meta" [fields]="fields" />
        </section>
        <section class="card" aria-labelledby="schedule-title">
          <h2 id="schedule-title" class="h-sm">Weekly schedule</h2>
          <p class="text-small text-muted">Days per week is calculated from the non-rest days.</p>
          <app-schedule-editor [days]="f.schedule" />
        </section>
        @if (submitted() && (f.meta.invalid || f.schedule.invalid)) {
          <p class="alert alert--danger" role="alert">
            Please complete the required fields and select an exercise for every row.
          </p>
        }
        <div class="form-actions">
          <a class="btn btn--ghost" routerLink="/admin/programs">Cancel</a>
          <button type="submit" class="btn btn--primary" [disabled]="saving()">Save program</button>
        </div>
      </form>
    } @else {
      <app-not-found-content
        what="program"
        backLink="/admin/programs"
        backLabel="Back to programs"
      />
    }
  `,
  styleUrl: '../../dashboard/pages/dashboard-pages.scss',
  styles: `
    .back {
      display: inline-flex;
      margin-bottom: var(--sp-3);
    }
  `,
})
export class ProgramEditorPage {
  private readonly programs = inject(ProgramStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly id = input.required<string>();

  protected readonly fields = PROGRAM_FIELDS;
  protected readonly saving = signal(false);
  protected readonly submitted = signal(false);
  protected readonly isNew = computed(() => this.id() === 'new');
  protected readonly existing = computed(() =>
    this.isNew() ? undefined : this.programs.get(this.id()),
  );

  protected readonly forms = computed<{ meta: FormGroup; schedule: FormArray<DayGroup> } | null>(
    () => {
      const program = this.existing();
      if (!this.isNew() && !program) return null;
      return {
        meta: buildSchemaGroup(
          PROGRAM_FIELDS,
          program
            ? { ...program }
            : {
                level: 'beginner',
                goal: 'muscle-gain',
                trainingType: 'full-body',
                durationWeeks: 8,
                sessionMinutes: '60',
              },
        ),
        schedule: buildScheduleArray(program?.schedule ?? DEFAULT_WEEK),
      };
    },
  );

  protected save(meta: FormGroup, schedule: FormArray<DayGroup>): void {
    this.submitted.set(true);
    if (meta.invalid || schedule.invalid) {
      meta.markAllAsTouched();
      schedule.markAllAsTouched();
      return;
    }
    const v = readSchemaGroup(PROGRAM_FIELDS, meta);
    const days = readSchedule(schedule);
    const existing = this.existing();
    const slug = str(v['slug']) || slugify(str(v['name']));
    const program: TrainingProgram = {
      id: existing?.id ?? slug,
      slug,
      name: str(v['name']),
      tagline: str(v['tagline']),
      description: str(v['description']),
      level: str(v['level']) as DifficultyLevel,
      goal: str(v['goal']) as ProgramGoal,
      trainingType: str(v['trainingType']) as TrainingType,
      daysPerWeek: days.filter((d) => !d.isRestDay).length,
      durationWeeks: num(v['durationWeeks'], 8),
      sessionMinutes: str(v['sessionMinutes']),
      price: optNum(v['price']),
      equipment: list<Equipment>(v['equipment']),
      targetAudience: list(v['targetAudience']),
      structure: list(v['structure']),
      warmUp: list(v['warmUp']),
      progression: list(v['progression']),
      recovery: list(v['recovery']),
      featured: bool(v['featured']),
      schedule: days,
    };
    if (this.isNew() && this.programs.get(program.id)) {
      this.toast.error('A program with this name/slug already exists.');
      return;
    }
    this.saving.set(true);
    this.programs
      .save(program, this.isNew())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Program saved.');
          void this.router.navigate(['/admin/programs']);
        },
        error: (e: Error) => this.toast.error(e.message),
      });
  }
}
