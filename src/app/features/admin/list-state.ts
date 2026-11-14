import { Signal, computed, linkedSignal, signal } from '@angular/core';
import { paginate } from '../../shared/ui/paginator';

const DEFAULT_PAGE_SIZE = 10;

/** Search + optional filter + pagination state for admin tables. */
export function createListState<T>(
  source: Signal<readonly T[]>,
  searchText: (item: T) => string,
  filterFn?: (item: T, value: string) => boolean,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const query = signal('');
  const filter = signal('');
  const filtered = computed(() => {
    const q = query().trim().toLowerCase();
    const f = filter();
    return source().filter(
      (item) =>
        (!q || searchText(item).toLowerCase().includes(q)) &&
        (!f || !filterFn || filterFn(item, f)),
    );
  });
  const page = linkedSignal({ source: () => [query(), filter()], computation: () => 1 });
  const visible = computed(() => paginate(filtered(), page(), pageSize));
  return { query, filter, filtered, page, visible, pageSize };
}
