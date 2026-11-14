import { ProviderToken } from '@angular/core';
import { EntityStore } from '../../../core/data-access/entity-store';
import { Entity } from '../../../core/models';
import { FieldDef, FormRecord } from '../forms/schema-form';

export interface ColumnDef<T> {
  readonly label: string;
  readonly value: (item: T) => string;
  /** Optional badge styling for status-like columns. */
  readonly tone?: (item: T) => 'success' | 'accent' | 'danger' | null;
}

export interface FilterDef<T> {
  readonly label: string;
  readonly options: readonly { value: string; label: string }[];
  readonly matches: (item: T, value: string) => boolean;
}

/**
 * Everything the generic admin list and editor need to manage one kind of entity.
 * Adding a new manageable entity means adding one config — no new pages.
 */
export interface ResourceConfig<T extends Entity> {
  readonly key: string;
  readonly singular: string;
  readonly plural: string;
  readonly description: string;
  readonly icon: string;
  readonly store: ProviderToken<EntityStore<T>>;
  readonly columns: readonly ColumnDef<T>[];
  readonly searchText: (item: T) => string;
  readonly filter?: FilterDef<T>;
  readonly fields: readonly FieldDef[];
  readonly toForm: (item: T) => FormRecord;
  readonly fromForm: (value: FormRecord, existing: T | undefined) => T;
  readonly blank: () => FormRecord;
  readonly publicUrl?: (item: T) => string | null;
  /** Custom editor route (e.g. programs use the workout chart builder). */
  readonly editPath?: (id: string) => string;
  readonly allowCreate?: boolean;
}

/** Erases the entity type so heterogeneous configs can live in one registry. */
export function defineResource<T extends Entity>(
  config: ResourceConfig<T>,
): ResourceConfig<Entity> {
  return config as unknown as ResourceConfig<Entity>;
}
