import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Entity } from '../models';
import type { EntityRepository, RepositoryStatus } from './entity-repository';
import { toApiError } from './api-error';

/**
 * REST adapter. Expected contract (JSON):
 *   GET    {base}/{resource}        → T[]
 *   POST   {base}/{resource}        → T
 *   PATCH  {base}/{resource}/{id}   → T
 *   DELETE {base}/{resource}/{id}   → 204
 * Authentication uses an httpOnly session cookie (see the credentials interceptor).
 */
export class HttpEntityRepository<T extends Entity> implements EntityRepository<T> {
  private readonly state = signal<readonly T[]>([]);
  private readonly statusState = signal<RepositoryStatus>('idle');
  private readonly errorState = signal<string | null>(null);

  readonly items = this.state.asReadonly();
  readonly status = this.statusState.asReadonly();
  readonly error = this.errorState.asReadonly();

  private readonly url: string;

  constructor(
    resource: string,
    private readonly http: HttpClient,
    baseUrl: string,
  ) {
    this.url = `${baseUrl.replace(/\/$/, '')}/${resource}`;
    this.refresh();
  }

  refresh(): void {
    this.statusState.set('loading');
    this.errorState.set(null);
    this.http.get<T[]>(this.url).subscribe({
      next: (items) => {
        this.state.set(items);
        this.statusState.set('ready');
      },
      error: (err: unknown) => {
        this.errorState.set(toApiError(err).message);
        this.statusState.set('error');
      },
    });
  }

  create(item: T): Observable<T> {
    return this.http
      .post<T>(this.url, item)
      .pipe(tap((created) => this.state.update((items) => [created, ...items])));
  }

  update(id: string, changes: Partial<T>): Observable<T> {
    return this.http
      .patch<T>(`${this.url}/${encodeURIComponent(id)}`, changes)
      .pipe(
        tap((updated) =>
          this.state.update((items) =>
            items.map((entity) => (entity.id === id ? updated : entity)),
          ),
        ),
      );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${encodeURIComponent(id)}`).pipe(
      tap(() => this.state.update((items) => items.filter((entity) => entity.id !== id))),
      map(() => undefined),
    );
  }
}
