import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Injector,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { EntityStore } from '../../../core/data-access/entity-store';
import { Entity } from '../../../core/models';
import { ToastService } from '../../../core/services/toast.service';
import { Icon } from '../../../shared/ui/icon/icon';
import { Paginator } from '../../../shared/ui/paginator';
import { NotFoundContent } from '../../not-found/not-found-content';
import { createListState } from '../list-state';
import { findResource } from '../resources/resource.registry';

@Component({
  selector: 'app-resource-list-page',
  imports: [RouterLink, Icon, Paginator, NotFoundContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (config(); as cfg) {
      <header class="page-head page-head--row">
        <div>
          <p class="eyebrow">Manage</p>
          <h1>{{ cfg.plural }}</h1>
          <p class="text-muted">{{ cfg.description }}</p>
        </div>
        @if (cfg.allowCreate !== false) {
          <a class="btn btn--primary" [routerLink]="editLink('new')"
            ><app-icon name="plus" [size]="18" /> New {{ cfg.singular.toLowerCase() }}</a
          >
        }
      </header>

      @if (state(); as s) {
        <div class="toolbar" role="search">
          <label class="visually-hidden" for="admin-search">Search {{ cfg.plural }}</label>
          <input
            id="admin-search"
            class="input"
            type="search"
            placeholder="Search…"
            [value]="s.query()"
            (input)="s.query.set(readValue($event))"
          />
          @if (cfg.filter; as f) {
            <label class="visually-hidden" for="admin-filter">{{ f.label }}</label>
            <select
              id="admin-filter"
              class="select"
              [value]="s.filter()"
              (change)="s.filter.set(readValue($event))"
            >
              <option value="">All {{ f.label.toLowerCase() }}</option>
              @for (o of f.options; track o.value) {
                <option [value]="o.value">{{ o.label }}</option>
              }
            </select>
          }
          <span class="text-small text-muted">{{ s.filtered().length }} total</span>
        </div>

        @if (store()?.status() === 'loading') {
          <div class="skeleton" style="height: 240px"></div>
        } @else if (store()?.error(); as error) {
          <div class="alert alert--danger" role="alert">
            <p>{{ error }}</p>
          </div>
        } @else if (s.visible().length) {
          <div class="table-wrap">
            <table class="table">
              <caption class="visually-hidden">
                {{
                  cfg.plural
                }}
              </caption>
              <thead>
                <tr>
                  @for (col of cfg.columns; track col.label) {
                    <th scope="col">{{ col.label }}</th>
                  }
                  <th scope="col"><span class="visually-hidden">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                @for (item of s.visible(); track item.id) {
                  <tr>
                    @for (col of cfg.columns; track col.label; let first = $first) {
                      <td>
                        @if (first) {
                          <a [routerLink]="editLink(item.id)" class="row-link">{{
                            col.value(item)
                          }}</a>
                        } @else if (col.tone) {
                          <span
                            class="badge"
                            [class]="'badge badge--' + (col.tone(item) ?? 'none')"
                            >{{ col.value(item) }}</span
                          >
                        } @else {
                          {{ col.value(item) }}
                        }
                      </td>
                    }
                    <td class="actions">
                      @if (cfg.publicUrl?.(item); as url) {
                        <a
                          class="btn btn--ghost btn--sm"
                          [routerLink]="url"
                          target="_blank"
                          [attr.aria-label]="'View on website'"
                          ><app-icon name="eye" [size]="16"
                        /></a>
                      }
                      <a
                        class="btn btn--ghost btn--sm"
                        [routerLink]="editLink(item.id)"
                        aria-label="Edit"
                        ><app-icon name="edit" [size]="16"
                      /></a>
                      <button
                        type="button"
                        class="btn btn--ghost btn--sm"
                        (click)="remove(item)"
                        aria-label="Delete"
                      >
                        <app-icon name="trash" [size]="16" />
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <app-paginator
            [page]="s.page()"
            [pageSize]="s.pageSize"
            [total]="s.filtered().length"
            (pageChange)="s.page.set($event)"
          />
        } @else {
          <div class="card empty">
            <p>No {{ cfg.plural.toLowerCase() }} found.</p>
          </div>
        }
      }
    } @else {
      <app-not-found-content
        heading="This admin section doesn't exist"
        backLink="/admin"
        backLabel="Admin overview"
      />
    }
  `,
  styleUrl: '../../dashboard/pages/dashboard-pages.scss',
  styles: `
    .row-link {
      color: var(--c-text);
      font-weight: 600;
      text-decoration: none;
    }
    .row-link:hover {
      color: var(--c-accent);
    }
  `,
})
export class ResourceListPage {
  private readonly injector = inject(Injector);
  private readonly toast = inject(ToastService);

  readonly resource = input.required<string>();

  protected readonly config = computed(() => findResource(this.resource()));
  protected readonly store = computed<EntityStore<Entity> | undefined>(() => {
    const cfg = this.config();
    return cfg ? this.injector.get(cfg.store) : undefined;
  });
  protected readonly state = computed(() => {
    const cfg = this.config();
    const store = this.store();
    return cfg && store
      ? createListState(store.all, cfg.searchText, cfg.filter?.matches)
      : undefined;
  });

  protected editLink(id: string): string {
    const cfg = this.config();
    return cfg?.editPath ? cfg.editPath(id) : `/admin/${this.resource()}/${id}`;
  }

  protected readValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected remove(item: Entity): void {
    const cfg = this.config();
    const label = cfg?.columns[0]?.value(item) ?? item.id;
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Delete “${label}”? This cannot be undone.`)
    )
      return;
    this.store()
      ?.remove(item.id)
      .subscribe({
        next: () => this.toast.info(`“${label}” deleted.`),
        error: (e: Error) => this.toast.error(e.message),
      });
  }
}
