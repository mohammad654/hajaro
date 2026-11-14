import { ApplicationRef, Signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Entity } from '../models';
import { BrowserStorage } from '../services/browser-storage.service';
import { HttpEntityRepository } from './http-entity-repository';
import { LocalEntityRepository } from './local-entity-repository';

export type RepositoryStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * The integration boundary between features and the data source.
 *
 * Features depend only on this interface. Two adapters implement it:
 * - {@link LocalEntityRepository}: seeded, browser-persisted data for demo / no-backend mode.
 * - {@link HttpEntityRepository}: REST adapter (`GET/POST /{resource}`, `PATCH/DELETE /{resource}/{id}`).
 *
 * The backend is responsible for authorisation and for scoping client data to the signed-in user.
 */
export interface EntityRepository<T extends Entity> {
  readonly items: Signal<readonly T[]>;
  readonly status: Signal<RepositoryStatus>;
  readonly error: Signal<string | null>;
  refresh(): void;
  create(item: T): Observable<T>;
  update(id: string, changes: Partial<T>): Observable<T>;
  remove(id: string): Observable<void>;
}

/** Creates the repository adapter for the configured environment. Must run in an injection context. */
export function injectRepository<T extends Entity>(
  resource: string,
  seed: readonly T[],
): EntityRepository<T> {
  if (environment.useMockApi) {
    return new LocalEntityRepository<T>(
      resource,
      seed,
      inject(BrowserStorage),
      inject(ApplicationRef),
      environment.dataVersion,
    );
  }
  return new HttpEntityRepository<T>(resource, inject(HttpClient), environment.apiBaseUrl);
}

export function newId(prefix = ''): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}-${random}` : random;
}
