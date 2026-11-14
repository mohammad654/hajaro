import { Pipe, PipeTransform } from '@angular/core';
import { CURRENT_LOCALE } from '../../core/i18n/current-locale';

const SECONDS_PER_MINUTE = 60;
/** Decimal separator of the page language: 1.5 (en) / 1,5 (nl). */
const minutesFormat = new Intl.NumberFormat(CURRENT_LOCALE.code, { maximumFractionDigits: 1 });

export function formatRest(seconds: number): string {
  if (!seconds) return '—';
  if (seconds < SECONDS_PER_MINUTE) return `${seconds} s`;
  return `${minutesFormat.format(seconds / SECONDS_PER_MINUTE)} min`;
}

/** 90 → "1.5 min" (en) or "1,5 min" (nl), 45 → "45 s" */
@Pipe({ name: 'rest' })
export class RestPipe implements PipeTransform {
  transform(seconds: number | null | undefined): string {
    return formatRest(seconds ?? 0);
  }
}

/** Looks up a display label in a record, e.g. `level | label: DIFFICULTY_LABELS`. */
@Pipe({ name: 'label' })
export class LabelPipe implements PipeTransform {
  transform<K extends string>(
    value: K | null | undefined,
    labels: Readonly<Record<K, string>>,
  ): string {
    return value ? (labels[value] ?? value) : '';
  }
}
