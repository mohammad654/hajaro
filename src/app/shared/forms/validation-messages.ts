import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Human-readable messages for validation errors, in priority order. */
export function validationMessage(errors: ValidationErrors | null, label: string): string | null {
  if (!errors) return null;
  if (errors['required'] || errors['requiredTrue']) return $localize`${label}:FIELD: is required.`;
  if (errors['email']) return $localize`Enter a valid email address, like name@example.com.`;
  if (errors['minlength']) {
    const min = errors['minlength'].requiredLength;
    return $localize`${label}:FIELD: needs at least ${min}:MIN: characters.`;
  }
  if (errors['maxlength']) {
    const max = errors['maxlength'].requiredLength;
    return $localize`${label}:FIELD: can have at most ${max}:MAX: characters.`;
  }
  if (errors['min']) return $localize`${label}:FIELD: must be at least ${errors['min'].min}:MIN:.`;
  if (errors['max']) return $localize`${label}:FIELD: can be at most ${errors['max'].max}:MAX:.`;
  if (errors['pattern']) return $localize`${label}:FIELD: is not in the right format.`;
  if (errors['phone']) return $localize`Enter a valid phone number, for example +31 6 12345678.`;
  if (errors['url']) return $localize`Enter a valid link that starts with https://.`;
  if (errors['slug']) return $localize`Use lowercase letters, numbers and hyphens only.`;
  if (errors['server']) return String(errors['server']);
  return $localize`${label}:FIELD: is not valid.`;
}

/** Optional international phone number: digits, spaces, +, -, parentheses. */
export const phoneValidator: ValidatorFn = (control: AbstractControl) => {
  const value = String(control.value ?? '').trim();
  if (!value) return null;
  return /^\+?[0-9\s\-()]{7,20}$/.test(value) ? null : { phone: true };
};

export const slugValidator: ValidatorFn = (control: AbstractControl) => {
  const value = String(control.value ?? '');
  return !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? null : { slug: true };
};

/** Optional https URL (or site-relative path starting with "/"). */
export const urlValidator: ValidatorFn = (control: AbstractControl) => {
  const value = String(control.value ?? '').trim();
  if (!value) return null;
  if (value.startsWith('/') && !value.startsWith('//')) return null;
  try {
    return new URL(value).protocol === 'https:' ? null : { url: true };
  } catch {
    return { url: true };
  }
};

/** Converts a title into a URL slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Splits a multi-line textarea into trimmed, non-empty lines. */
export function linesToList(text: string | null | undefined): string[] {
  return String(text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function listToLines(list: readonly string[] | null | undefined): string {
  return (list ?? []).join('\n');
}
