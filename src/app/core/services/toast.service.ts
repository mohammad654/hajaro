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
    this.state.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private show(kind: ToastKind, message: string): void {
    const toast: Toast = { id: ++this.nextId, kind, message };
    this.state.update((toasts) => [...toasts, toast].slice(-MAX_VISIBLE_TOASTS));
    if (typeof window !== 'undefined') {
      setTimeout(() => this.dismiss(toast.id), TOAST_DURATION_MS);
    }
  }
}
