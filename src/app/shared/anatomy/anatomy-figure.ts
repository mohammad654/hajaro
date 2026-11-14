import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MuscleStore } from '../../core/data-access/muscle.store';
import {
  ANATOMY_FIGURES,
  ANATOMY_VIEWBOX,
  BODY_SILHOUETTE,
} from '../../core/data/anatomy-shapes.data';
import { AnatomyView, MuscleId } from '../../core/models';

/** Mirrors right-side artwork onto the left side of the figure. */
const MIRROR = `matrix(-1 0 0 1 ${ANATOMY_VIEWBOX.width} 0)`;
let figureCount = 0;

interface RenderedMuscle {
  readonly id: MuscleId;
  readonly name: string;
  readonly paths: readonly string[];
  readonly state: 'primary' | 'secondary' | 'none';
}

/**
 * Original vector anatomy illustration with selectable muscle regions.
 * - Presentational: highlight `primary` / `secondary` muscles (exercise illustrations, hero art).
 * - Interactive: emits `muscleSelect` on click / Enter / Space; every region is keyboard-focusable.
 */
@Component({
  selector: 'app-anatomy-figure',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './anatomy-figure.html',
  styleUrl: './anatomy-figure.scss',
  host: {
    '[class.is-interactive]': 'interactive()',
    '[class.is-animated]': 'animated()',
  },
})
export class AnatomyFigure {
  private readonly muscles = inject(MuscleStore);

  readonly view = input<AnatomyView>('front');
  readonly primary = input<readonly MuscleId[]>([]);
  readonly secondary = input<readonly MuscleId[]>([]);
  readonly interactive = input(false);
  /** Gentle glow on highlighted muscles (disabled automatically for reduced-motion users). */
  readonly animated = input(false);
  /** Accessible description of the illustration when it is not interactive. */
  readonly label = input('');

  readonly muscleSelect = output<MuscleId>();
  readonly muscleHover = output<MuscleId | null>();

  protected readonly viewBox = `0 0 ${ANATOMY_VIEWBOX.width} ${ANATOMY_VIEWBOX.height}`;
  protected readonly silhouette = BODY_SILHOUETTE;
  protected readonly mirror = MIRROR;
  /** Unique per instance so several figures can share a page. */
  protected readonly glowId = `anatomy-glow-${++figureCount}`;
  protected readonly glowFill = `url(#${this.glowId})`;
  protected readonly figure = computed(() => ANATOMY_FIGURES[this.view()]);

  protected readonly regions = computed<readonly RenderedMuscle[]>(() => {
    const primary = new Set(this.primary());
    const secondary = new Set(this.secondary());
    return this.figure().muscles.map((shape) => ({
      id: shape.muscle,
      name: this.muscles.get(shape.muscle)?.name ?? shape.muscle,
      paths: shape.paths,
      state: primary.has(shape.muscle)
        ? 'primary'
        : secondary.has(shape.muscle)
          ? 'secondary'
          : 'none',
    }));
  });

  protected readonly deepRegions = computed(() => {
    const active = new Set([...this.primary(), ...this.secondary()]);
    return this.figure().deepMuscles.map((shape) => ({
      id: shape.muscle,
      paths: shape.paths,
      active: active.has(shape.muscle),
    }));
  });

  protected readonly ariaLabel = computed(() => {
    if (this.label()) return this.label();
    const side = this.view() === 'front' ? 'Front' : 'Back';
    return this.interactive()
      ? `${side} view anatomy chart. Select a muscle to see how to train it.`
      : `${side} view anatomy illustration`;
  });

  protected select(id: MuscleId, event?: Event): void {
    if (!this.interactive()) return;
    event?.preventDefault();
    this.muscleSelect.emit(id);
  }

  protected hover(id: MuscleId | null): void {
    if (this.interactive()) this.muscleHover.emit(id);
  }
}
