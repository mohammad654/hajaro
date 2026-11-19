import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { MuscleStore } from '../../core/data-access/muscle.store';
import {
  AnatomyView,
  MUSCLE_REGION_LABELS,
  MuscleGroup,
  MuscleId,
  MuscleRegion,
} from '../../core/models';
import { AnatomyFigure } from '../../shared/anatomy/anatomy-figure';
import { Icon } from '../../shared/ui/icon/icon';

/**
 * Interactive anatomy chart: front/back toggle, clickable SVG regions and an equivalent,
 * keyboard-friendly muscle list grouped by region (also the only way to reach deep muscles).
 */
@Component({
  selector: 'app-anatomy-explorer',
  imports: [AnatomyFigure, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="explorer">
      <div class="explorer__stage card">
        <div class="explorer__toolbar">
          <div class="toggle" role="group" i18n-aria-label aria-label="Anatomy view">
            <button
              type="button"
              class="chip"
              [attr.aria-pressed]="view() === 'front'"
              (click)="view.set('front')"
              i18n="side of the body|Toggle for the anatomy view"
            >
              Front
            </button>
            <button
              type="button"
              class="chip"
              [attr.aria-pressed]="view() === 'back'"
              (click)="view.set('back')"
              i18n="side of the body|Toggle for the anatomy view"
            >
              Back
            </button>
          </div>
          <button type="button" class="btn btn--ghost btn--sm" (click)="flip()">
            <app-icon name="rotate" [size]="16" /> <ng-container i18n>Rotate</ng-container>
          </button>
        </div>

        <app-anatomy-figure
          class="explorer__figure"
          [view]="view()"
          [primary]="selected() ? [selected()!] : []"
          [interactive]="true"
          (muscleSelect)="muscleSelect.emit($event)"
          (muscleHover)="hovered.set($event)"
        />

        <p class="explorer__label" aria-live="polite">
          @if (labelMuscle(); as m) {
            <strong>{{ m.name }}</strong> <span>{{ m.anatomicalName }}</span>
          } @else {
            <span i18n>Tap or click a muscle to explore it</span>
          }
        </p>
      </div>

      <nav class="muscle-list" i18n-aria-label aria-label="Muscle groups">
        @for (group of groups; track group.region) {
          <div class="muscle-list__group">
            <h3>{{ group.label }}</h3>
            <ul>
              @for (m of group.muscles; track m.id) {
                <li>
                  <button
                    type="button"
                    class="chip chip--sm"
                    [attr.aria-pressed]="selected() === m.id"
                    (click)="muscleSelect.emit(m.id)"
                  >
                    {{ m.name }}
                    @if (m.deep) {
                      <span class="deep-tag" i18n>deep</span>
                    }
                  </button>
                </li>
              }
            </ul>
          </div>
        }
      </nav>
    </div>
  `,
  styles: `
    .explorer {
      display: grid;
      gap: var(--sp-5);
    }
    .explorer__stage {
      position: relative;
      padding: var(--sp-4);
      background:
        radial-gradient(60% 50% at 50% 40%, var(--c-accent-glow), transparent 70%), var(--c-surface);
    }
    .explorer__toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-3);
      margin-bottom: var(--sp-3);
    }
    .toggle {
      display: flex;
      gap: var(--sp-2);
    }
    .explorer__figure {
      max-width: 360px;
      margin-inline: auto;
    }
    .explorer__label {
      min-height: 3rem;
      margin: var(--sp-3) 0 0;
      text-align: center;
      display: grid;
    }
    .explorer__label strong {
      font-family: var(--font-display);
      font-size: var(--fs-lg);
      text-transform: uppercase;
      color: var(--c-accent);
    }
    .explorer__label span {
      font-size: var(--fs-sm);
      color: var(--c-text-muted);
    }
    .muscle-list {
      display: grid;
      gap: var(--sp-4);
    }
    .muscle-list h3 {
      font-family: var(--font-body);
      font-size: var(--fs-xs);
      font-weight: 600;
      letter-spacing: var(--tracking-wider);
      color: var(--c-text-subtle);
      margin-bottom: var(--sp-2);
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-2);
    }
    .chip--sm {
      min-height: 34px;
      padding: 0 var(--sp-3);
      font-size: var(--fs-xs);
    }
    .deep-tag {
      font-size: var(--fs-2xs);
      opacity: 0.75;
      text-transform: uppercase;
      letter-spacing: var(--tracking-wide);
    }
  `,
})
export class AnatomyExplorer {
  private readonly muscles = inject(MuscleStore);

  readonly selected = input<MuscleId | null>(null);
  readonly view = model<AnatomyView>('front');
  readonly muscleSelect = output<MuscleId>();

  protected readonly hovered = signal<MuscleId | null>(null);
  protected readonly labelMuscle = computed(() =>
    this.muscles.get(this.hovered() ?? this.selected()),
  );

  protected readonly groups = (Object.keys(MUSCLE_REGION_LABELS) as MuscleRegion[]).map(
    (region) => ({
      region,
      label: MUSCLE_REGION_LABELS[region],
      muscles: this.muscles.all.filter((m: MuscleGroup) => m.region === region),
    }),
  );

  protected flip(): void {
    this.view.update((v) => (v === 'front' ? 'back' : 'front'));
  }
}
