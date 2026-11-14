import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Human-readable messages for validation errors, in priority order. */
export function validationMessage(errors: ValidationErrors | null, label: string): string | null {
  if (!errors) return null;
  if (errors['required'] || errors['requiredTrue']) return `${label} is required.`;
  if (errors['email']) return 'Please enter a valid email address.';
  if (errors['minlength'])
    return `${label} must be at least ${errors['minlength'].requiredLength} characters.`;
  if (errors['maxlength'])
    return `${label} must be at most ${errors['maxlength'].requiredLength} characters.`;
  if (errors['min']) return `${label} must be at least ${errors['min'].min}.`;
  if (errors['max']) return `${label} must be at most ${errors['max'].max}.`;
  if (errors['pattern']) return `${label} has an invalid format.`;
  if (errors['phone']) return 'Please enter a valid phone number.';
  if (errors['url']) return 'Please enter a valid https:// URL.';
  if (errors['slug']) return 'Use lowercase letters, numbers and hyphens only.';
  if (errors['server']) return String(errors['server']);
  return `${label} is invalid.`;
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
