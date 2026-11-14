import { Signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityRepository, RepositoryStatus, injectRepository } from '../api/entity-repository';
import { Entity } from '../models';

/**
 * Base class for domain stores: exposes reactive collections and CRUD on top of a repository.
 * Concrete stores add domain queries (by slug, by client, filters…).
 * Subclasses must be created by Angular DI (they call `injectRepository` in the constructor).
 */
export abstract class EntityStore<T extends Entity> {
  protected readonly repo: EntityRepository<T>;
  readonly all: Signal<readonly T[]>;
  readonly status: Signal<RepositoryStatus>;
  readonly error: Signal<string | null>;
  private readonly index: Signal<ReadonlyMap<string, T>>;

  protected constructor(resource: string, seed: readonly T[]) {
    this.repo = injectRepository<T>(resource, seed);
    this.all = this.repo.items;
    this.status = this.repo.status;
    this.error = this.repo.error;
    this.index = computed(() => new Map(this.all().map((item) => [item.id, item])));
  }

  /** Reactive lookup — safe to call inside `computed`. */
  get(id: string | null | undefined): T | undefined {
    return id ? this.index().get(id) : undefined;
  }

  save(entity: T, isNew: boolean): Observable<T> {
    return isNew ? this.repo.create(entity) : this.repo.update(entity.id, entity);
  }

  patch(id: string, changes: Partial<T>): Observable<T> {
    return this.repo.update(id, changes);
  }

  remove(id: string): Observable<void> {
    return this.repo.remove(id);
  }

  refresh(): void {
    this.repo.refresh();
  }
}
