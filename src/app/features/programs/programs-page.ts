import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProgramStore } from '../../core/data-access/program.store';
import {
  DIFFICULTY_LABELS,
  DifficultyLevel,
  PROGRAM_GOAL_LABELS,
  ProgramGoal,
  TRAINING_TYPE_LABELS,
  TrainingProgram,
  TrainingType,
} from '../../core/models';
import { applyPageSeo } from '../../core/seo/page-seo';
import { ProgramCard } from '../../shared/cards/program-card';
import { CtaSection } from '../../shared/ui/cta-section';
import { PageHero } from '../../shared/ui/page-hero';

type DurationBucket = 'short' | 'medium';
const DURATION_LABELS: Readonly<Record<DurationBucket, string>> = {
  short: $localize`Up to 8 weeks`,
  medium: $localize`9 to 12 weeks`,
};
const SHORT_PROGRAM_MAX_WEEKS = 8;

const entries = <K extends string>(labels: Readonly<Record<K, string>>) =>
  (Object.keys(labels) as K[]).map((value) => ({ value, label: labels[value] }));

@Component({
  selector: 'app-programs-page',
  imports: [PageHero, ProgramCard, CtaSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './programs-page.html',
  styleUrl: './programs-page.scss',
})
export class ProgramsPage {
  private readonly programs = inject(ProgramStore);

  protected readonly levelOptions = entries(DIFFICULTY_LABELS);
  protected readonly goalOptions = entries(PROGRAM_GOAL_LABELS);
  protected readonly typeOptions = entries(TRAINING_TYPE_LABELS);
  protected readonly durationOptions = entries(DURATION_LABELS);

  protected readonly level = signal<DifficultyLevel | ''>('');
  protected readonly goal = signal<ProgramGoal | ''>('');
  protected readonly type = signal<TrainingType | ''>('');
  protected readonly duration = signal<DurationBucket | ''>('');

  protected readonly hasFilters = computed(
    () => !!(this.level() || this.goal() || this.type() || this.duration()),
  );

  protected readonly breadcrumbs = [{ label: $localize`Programs`, url: '/programs' }];
  protected readonly results = computed(() => this.programs.all().filter((p) => this.matches(p)));

  constructor() {
    applyPageSeo('programs', {
      title: $localize`Training Programs for Muscle & Strength`,
      description: $localize`Training programs for every level: muscle building, strength, fat loss, push/pull/legs, upper/lower, full body and home workouts.`,
    });
  }

  protected reset(): void {
    this.level.set('');
    this.goal.set('');
    this.type.set('');
    this.duration.set('');
  }

  protected readValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  private matches(p: TrainingProgram): boolean {
    if (this.level() && p.level !== this.level()) return false;
    if (this.goal() && p.goal !== this.goal()) return false;
    if (this.type() && p.trainingType !== this.type()) return false;
    const duration = this.duration();
    if (duration === 'short' && p.durationWeeks > SHORT_PROGRAM_MAX_WEEKS) return false;
    if (duration === 'medium' && p.durationWeeks <= SHORT_PROGRAM_MAX_WEEKS) return false;
    return true;
  }
}
