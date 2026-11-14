import { Pipe, PipeTransform } from '@angular/core';

const SECONDS_PER_MINUTE = 60;

export function formatRest(seconds: number): string {
  if (!seconds) return '—';
  if (seconds < SECONDS_PER_MINUTE) return `${seconds} s`;
  const minutes = seconds / SECONDS_PER_MINUTE;
  return Number.isInteger(minutes)
    ? `${minutes} min`
    : `${minutes.toFixed(1).replace('.0', '')} min`;
}

/** 90 → "1.5 min", 45 → "45 s" */
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
