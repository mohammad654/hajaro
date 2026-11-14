import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SITE_CONFIG } from '../../core/config/site.config';
import { ExerciseStore } from '../../core/data-access/exercise.store';
import { ProgramStore } from '../../core/data-access/program.store';
import {
  DIFFICULTY_LABELS,
  EQUIPMENT_LABELS,
  PROGRAM_GOAL_LABELS,
  TRAINING_TYPE_LABELS,
  WorkoutDay,
} from '../../core/models';
import { injectNotFoundStatus } from '../../core/seo/http-status';
import { programSchema } from '../../core/seo/schema.builders';
import { SeoService } from '../../core/seo/seo.service';
import { ProgramCard } from '../../shared/cards/program-card';
import { LabelPipe } from '../../shared/pipes/format.pipes';
import { CtaSection } from '../../shared/ui/cta-section';
import { PageHero } from '../../shared/ui/page-hero';
import { NotFoundContent } from '../not-found/not-found-content';
import { WorkoutDayTable } from './workout-day-table';

@Component({
  selector: 'app-program-detail-page',
  imports: [
    RouterLink,
    CurrencyPipe,
    PageHero,
    LabelPipe,
    ProgramCard,
    CtaSection,
    NotFoundContent,
    WorkoutDayTable,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-detail-page.html',
  styleUrl: './program-detail-page.scss',
})
export class ProgramDetailPage {
  private readonly seo = inject(SeoService);
  private readonly programs = inject(ProgramStore);
  private readonly exercises = inject(ExerciseStore);
  private readonly markNotFound = injectNotFoundStatus();

  readonly slug = input.required<string>();

  protected readonly currency = SITE_CONFIG.currency;
  protected readonly levels = DIFFICULTY_LABELS;
  protected readonly goals = PROGRAM_GOAL_LABELS;
  protected readonly types = TRAINING_TYPE_LABELS;
  protected readonly equipmentLabels = EQUIPMENT_LABELS;

  protected readonly program = computed(() => this.programs.bySlug(this.slug()));
  protected readonly selectedDayId = signal<string | null>(null);

  protected readonly trainingDays = computed(
    () => this.program()?.schedule.filter((d) => !d.isRestDay) ?? [],
  );
  protected readonly selectedDay = computed<WorkoutDay | undefined>(() => {
    const days = this.trainingDays();
    return days.find((d) => d.id === this.selectedDayId()) ?? days[0];
  });

  /** Unique example exercises across the program, for the overview. */
  protected readonly exampleExercises = computed(() => {
    const ids = new Set(this.trainingDays().flatMap((d) => d.exercises.map((e) => e.exerciseId)));
    return [...ids]
      .map((id) => this.exercises.get(id))
      .filter((e) => !!e)
      .slice(0, 8);
  });

  protected readonly related = computed(() => {
    const current = this.program();
    if (!current) return [];
    return this.programs
      .all()
      .filter((p) => p.id !== current.id && (p.level === current.level || p.goal === current.goal))
      .slice(0, 3);
  });

  constructor() {
    effect(() => {
      const program = this.program();
      if (!program) {
        this.markNotFound();
        this.seo.update({
          title: 'Program not found',
          description: 'This training program could not be found.',
          noindex: true,
        });
        return;
      }
      this.seo.update({
        title: `${program.name} Program — ${program.daysPerWeek} Days per Week`,
        description: `${program.tagline} ${program.durationWeeks}-week ${this.levels[program.level].toLowerCase()} program with full weekly schedule, sets, reps and progression.`,
        path: `/programs/${program.slug}`,
      });
      this.seo.setPageSchema(
        'program',
        programSchema((p) => this.seo.absoluteUrl(p), program),
      );
    });
  }
}
