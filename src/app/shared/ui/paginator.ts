import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (pageCount() > 1) {
      <nav class="paginator" aria-label="Pagination">
        <button type="button" class="btn btn--sm" [disabled]="page() <= 1" (click)="go(page() - 1)">
          Previous
        </button>
        <span class="paginator__status" aria-live="polite"
          >Page {{ page() }} of {{ pageCount() }}</span
        >
        <button
          type="button"
          class="btn btn--sm"
          [disabled]="page() >= pageCount()"
          (click)="go(page() + 1)"
        >
          Next
        </button>
      </nav>
    }
  `,
  styles: `
    .paginator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--sp-4);
      margin-top: var(--sp-6);
    }
    .paginator__status {
      font-size: var(--fs-sm);
      color: var(--c-text-muted);
    }
  `,
})
export class Paginator {
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly total = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize())),
  );

  protected go(page: number): void {
    this.pageChange.emit(Math.min(Math.max(1, page), this.pageCount()));
  }
}

/** Slices a list for the current page. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): readonly T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
