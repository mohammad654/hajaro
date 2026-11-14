import { ApplicationRef, signal } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { Entity } from '../models';
import { BrowserStorage } from '../services/browser-storage.service';
import type { EntityRepository, RepositoryStatus } from './entity-repository';
import { ApiError } from './api-error';

/** Simulated network latency so loading states are exercised in demo mode. */
const MOCK_LATENCY_MS = 250;

interface PersistedCollection<T> {
  readonly version: number;
  readonly items: readonly T[];
}

/**
 * In-browser adapter used when no backend is configured.
 *
 * Seed data renders immediately (and identically on the server), then any changes saved in this
 * browser are applied once the app is stable — after hydration, so prerendered markup always matches.
 */
export class LocalEntityRepository<T extends Entity> implements EntityRepository<T> {
  private readonly state = signal<readonly T[]>([]);
  private readonly statusState = signal<RepositoryStatus>('ready');

  readonly items = this.state.asReadonly();
  readonly status = this.statusState.asReadonly();
  readonly error = signal<string | null>(null).asReadonly();

  constructor(
    private readonly resource: string,
    private readonly seed: readonly T[],
    private readonly storage: BrowserStorage,
    appRef: ApplicationRef,
    private readonly version: number,
  ) {
    this.state.set(seed);
    void appRef.whenStable().then(() => this.restore());
  }

  refresh(): void {
    this.restore();
  }

  create(item: T): Observable<T> {
    this.commit([item, ...this.state()]);
    return of(item).pipe(delay(MOCK_LATENCY_MS));
  }

  update(id: string, changes: Partial<T>): Observable<T> {
    const existing = this.state().find((entity) => entity.id === id);
    if (!existing) {
      return throwError(() => new ApiError('The requested record no longer exists.', 404));
    }
    const updated = { ...existing, ...changes, id } as T;
    this.commit(this.state().map((entity) => (entity.id === id ? updated : entity)));
    return of(updated).pipe(delay(MOCK_LATENCY_MS));
  }

  remove(id: string): Observable<void> {
    this.commit(this.state().filter((entity) => entity.id !== id));
    return of(undefined).pipe(delay(MOCK_LATENCY_MS));
  }

  private commit(items: readonly T[]): void {
    this.state.set(items);
    this.storage.write<PersistedCollection<T>>(this.storageKey, { version: this.version, items });
  }

  private restore(): void {
    const persisted = this.storage.read<PersistedCollection<T>>(this.storageKey);
    if (persisted && persisted.version === this.version && Array.isArray(persisted.items)) {
      this.state.set(persisted.items);
    } else {
      this.state.set(this.seed);
    }
  }

  private get storageKey(): string {
    return `db:${this.resource}`;
  }
}
