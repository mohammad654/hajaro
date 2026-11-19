import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  input,
  linkedSignal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MuscleStore } from '../../core/data-access/muscle.store';
import { ClientReady } from '../../core/services/client-ready';
import { FULL_BODY_WORKOUT_CHART } from '../../core/data/programs.data';
import { AnatomyView, MuscleId } from '../../core/models';
import { applyPageSeo } from '../../core/seo/page-seo';
import { CtaSection } from '../../shared/ui/cta-section';
import { MediaFrame } from '../../shared/ui/media-frame';
import { PageHero } from '../../shared/ui/page-hero';
import { AnatomyExplorer } from './anatomy-explorer';
import { MuscleDetailPanel } from './muscle-detail-panel';
import { SplitPrograms } from './split-programs';
import { WorkoutChartTable } from './workout-chart-table';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-muscle-chart-page',
  imports: [
    LocalePathPipe,
    RouterLink,
    NgOptimizedImage,
    MediaFrame,
    PageHero,
    AnatomyExplorer,
    MuscleDetailPanel,
    WorkoutChartTable,
    SplitPrograms,
    CtaSection,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './muscle-chart-page.html',
  styleUrl: './muscle-chart-page.scss',
})
export class MuscleChartPage {
  private readonly router = inject(Router);
  private readonly muscles = inject(MuscleStore);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly ready = inject(ClientReady).ready;

  /** Selected muscle lives in the URL (?muscle=chest) so every state is shareable. */
  readonly muscleParam = input<string | undefined>(undefined, { alias: 'muscle' });

  protected readonly chart = FULL_BODY_WORKOUT_CHART;
  protected readonly breadcrumbs = [{ label: $localize`Muscle chart`, url: '/muscle-chart' }];
  protected readonly selectedId = computed<MuscleId | null>(() => {
    const param = this.ready() ? this.muscleParam() : undefined;
    return this.muscles.isMuscleId(param) ? param : null;
  });
  protected readonly selectedMuscle = computed(() => this.muscles.get(this.selectedId()));

  /** Follows the selection to a view where the muscle is visible, but remains user-switchable. */
  protected readonly view = linkedSignal<AnatomyView>(() => {
    const muscle = this.selectedMuscle();
    return muscle && !muscle.views.includes('front') ? 'back' : 'front';
  });

  private readonly detailAnchor = viewChild<ElementRef<HTMLElement>>('detail');

  constructor() {
    applyPageSeo('muscle-chart', {
      title: $localize`Full Body Muscle Chart & Workout Chart`,
      description: $localize`Tap any muscle to see what it does, the best exercises, sets and reps and common mistakes. With a full body workout chart and training splits.`,
      path: '/muscle-chart',
    });
  }

  /**
   * @param scroll Whether to bring the detail panel into view on narrow screens. Selections made
   * from the workout chart table pass `false` so the page stays where the user is.
   */
  protected select(id: MuscleId, scroll = true): void {
    const next = this.selectedId() === id ? null : id;
    void this.router.navigate([], {
      queryParams: { muscle: next },
      queryParamsHandling: 'merge',
      replaceUrl: true,
      preserveFragment: true,
      // Only the query param changes — stop the router's scroll restoration from jumping to
      // the top; scrollIntoView below decides where (if anywhere) to scroll.
      scroll: 'manual',
    });
    if (next && scroll) this.scrollToDetail();
  }

  private scrollToDetail(): void {
    if (!this.isBrowser) return;
    // On desktop the detail panel sits beside the chart; only scroll when it is stacked below.
    if (!window.matchMedia('(max-width: 1023.98px)').matches) return;
    setTimeout(() => this.detailAnchor()?.nativeElement.scrollIntoView({ block: 'start' }));
  }
}
