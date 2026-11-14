import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Option } from '../../../core/models';
import {
  linesToList,
  listToLines,
  slugValidator,
  urlValidator,
} from '../../../shared/forms/validation-messages';

export type FieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'slug'
  | 'textarea'
  | 'lines'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'date'
  | 'datetime';

/** Declarative description of one form field. */
export interface FieldDef {
  readonly key: string;
  readonly label: string;
  readonly type: FieldType;
  readonly required?: boolean;
  readonly options?: readonly Option[];
  readonly hint?: string;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly maxLength?: number;
  readonly rows?: number;
  /** Span both columns of the form grid. */
  readonly wide?: boolean;
}

export type FormRecord = Record<string, unknown>;

function validatorsFor(field: FieldDef): ValidatorFn[] {
  const v: ValidatorFn[] = [];
  if (field.required)
    v.push(field.type === 'checkbox' ? Validators.requiredTrue : Validators.required);
  if (field.maxLength) v.push(Validators.maxLength(field.maxLength));
  if (field.min !== undefined) v.push(Validators.min(field.min));
  if (field.max !== undefined) v.push(Validators.max(field.max));
  if (field.type === 'email') v.push(Validators.email);
  if (field.type === 'url') v.push(urlValidator);
  if (field.type === 'slug') v.push(slugValidator);
  return v;
}

/** Converts a model value into the representation the control edits. */
function toControlValue(field: FieldDef, value: unknown): unknown {
  switch (field.type) {
    case 'lines':
      return listToLines(Array.isArray(value) ? (value as string[]) : []);
    case 'multiselect':
      return Array.isArray(value) ? [...(value as string[])] : [];
    case 'checkbox':
      return Boolean(value);
    case 'number':
      return value === undefined || value === null || value === '' ? null : Number(value);
    case 'datetime':
      return typeof value === 'string' && value ? value.slice(0, 16) : '';
    default:
      return value ?? '';
  }
}

function fromControlValue(field: FieldDef, value: unknown): unknown {
  switch (field.type) {
    case 'lines':
      return linesToList(value as string);
    case 'number':
      return value === null || value === '' ? undefined : Number(value);
    case 'checkbox':
      return Boolean(value);
    case 'multiselect':
      return value as string[];
    case 'datetime':
      return value ? new Date(value as string).toISOString() : '';
    default:
      return typeof value === 'string' ? value.trim() : value;
  }
}

export function buildSchemaGroup(fields: readonly FieldDef[], value: FormRecord): FormGroup {
  const controls: Record<string, FormControl> = {};
  for (const field of fields) {
    controls[field.key] = new FormControl(
      toControlValue(field, value[field.key]),
      validatorsFor(field),
    );
  }
  return new FormGroup(controls);
}

export function readSchemaGroup(fields: readonly FieldDef[], group: FormGroup): FormRecord {
  const raw = group.getRawValue() as FormRecord;
  const out: FormRecord = {};
  for (const field of fields) out[field.key] = fromControlValue(field, raw[field.key]);
  return out;
}

/** Builds select options from a label map. */
export function optionsFrom(labels: Readonly<Record<string, string>>): Option[] {
  return Object.entries(labels).map(([value, label]) => ({ value, label }));
}

// Typed readers for converting form records back into models.
export const str = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
export const optStr = (v: unknown): string | undefined => str(v) || undefined;
export const num = (v: unknown, fallback = 0): number =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;
export const optNum = (v: unknown): number | undefined =>
  typeof v === 'number' && Number.isFinite(v) ? v : undefined;
export const bool = (v: unknown): boolean => v === true;
export const list = <T extends string = string>(v: unknown): T[] =>
  Array.isArray(v) ? (v as T[]) : [];
