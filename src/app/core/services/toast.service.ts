import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  readonly id: number;
  readonly kind: ToastKind;
  readonly message: string;
}

const TOAST_DURATION_MS = 5000;
const MAX_VISIBLE_TOASTS = 3;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private readonly state = signal<readonly Toast[]>([]);
  readonly toasts = this.state.asReadonly();
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.state.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private show(kind: ToastKind, message: string): void {
    // The same message again (e.g. a repeated error) keeps the one toast on screen a bit longer
    // instead of stacking identical copies.
    const existing = this.state().find((t) => t.kind === kind && t.message === message);
    const toast = existing ?? { id: ++this.nextId, kind, message };
    if (!existing) {
      const next = [...this.state(), toast];
      for (const dropped of next.slice(0, -MAX_VISIBLE_TOASTS)) {
        clearTimeout(this.timers.get(dropped.id));
        this.timers.delete(dropped.id);
      }
      this.state.set(next.slice(-MAX_VISIBLE_TOASTS));
    }
    if (typeof window !== 'undefined') {
      clearTimeout(this.timers.get(toast.id));
      this.timers.set(
        toast.id,
        setTimeout(() => this.dismiss(toast.id), TOAST_DURATION_MS),
      );
    }
  }
}
