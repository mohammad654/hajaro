import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface TrendPoint {
  readonly label: string;
  readonly value: number;
}

const WIDTH = 600;
const HEIGHT = 180;
const PADDING = 24;

/** Lightweight, dependency-free SVG line chart for progress trends. */
@Component({
  selector: 'app-trend-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (geometry(); as g) {
      <figure class="trend">
        <svg
          [attr.viewBox]="'0 0 ' + width + ' ' + height"
          role="img"
          [attr.aria-label]="label() + ': ' + summary()"
        >
          @for (y of g.grid; track y) {
            <line
              [attr.x1]="padding"
              [attr.x2]="width - padding"
              [attr.y1]="y"
              [attr.y2]="y"
              class="grid"
            />
          }
          <path [attr.d]="g.area" class="area" />
          <path [attr.d]="g.line" class="line" />
          @for (p of g.points; track $index) {
            <circle [attr.cx]="p.x" [attr.cy]="p.y" r="4" class="dot">
              <title>{{ p.label }}: {{ p.value }} {{ unit() }}</title>
            </circle>
          }
        </svg>
        <figcaption class="text-small text-muted">{{ summary() }}</figcaption>
      </figure>
    } @else {
      <p class="text-small text-muted">Add at least two entries to see your trend.</p>
    }
  `,
  styles: `
    svg {
      width: 100%;
      height: auto;
    }
    .grid {
      stroke: var(--c-border);
      stroke-width: 1;
    }
    .line {
      fill: none;
      stroke: var(--c-accent);
      stroke-width: 2.5;
      stroke-linejoin: round;
    }
    .area {
      fill: rgb(232 176 74 / 12%);
    }
    .dot {
      fill: var(--c-bg);
      stroke: var(--c-accent);
      stroke-width: 2;
    }
    figure {
      margin: 0;
    }
  `,
})
export class TrendChart {
  /** Points in chronological order. */
  readonly points = input.required<readonly TrendPoint[]>();
  readonly label = input('Trend');
  readonly unit = input('');

  protected readonly width = WIDTH;
  protected readonly height = HEIGHT;
  protected readonly padding = PADDING;

  protected readonly summary = computed(() => {
    const pts = this.points();
    if (pts.length < 2) return '';
    const first = pts[0].value;
    const last = pts[pts.length - 1].value;
    const diff = Math.round((last - first) * 10) / 10;
    return `${first} → ${last} ${this.unit()} (${diff >= 0 ? '+' : ''}${diff} ${this.unit()}) from ${pts[0].label} to ${pts[pts.length - 1].label}`;
  });

  protected readonly geometry = computed(() => {
    const pts = this.points();
    if (pts.length < 2) return null;
    const values = pts.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const x = (i: number) => PADDING + (i * (WIDTH - 2 * PADDING)) / (pts.length - 1);
    const y = (v: number) => HEIGHT - PADDING - ((v - min) / range) * (HEIGHT - 2 * PADDING);
    const points = pts.map((p, i) => ({ x: x(i), y: y(p.value), label: p.label, value: p.value }));
    const line = points
      .map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
    const area = `${line} L${points[points.length - 1].x},${HEIGHT - PADDING} L${points[0].x},${HEIGHT - PADDING} Z`;
    const grid = [0, 0.5, 1].map((f) => PADDING + f * (HEIGHT - 2 * PADDING));
    return { points, line, area, grid };
  });
}
