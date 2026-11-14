import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from './icon/icon';

@Component({
  selector: 'app-toast-outlet',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts" aria-live="polite" aria-atomic="false">
      @for (toast of toasts.toasts(); track toast.id) {
        <div
          class="toast"
          [class]="'toast toast--' + toast.kind"
          [attr.role]="toast.kind === 'error' ? 'alert' : 'status'"
        >
          <app-icon
            [name]="toast.kind === 'success' ? 'check' : toast.kind === 'error' ? 'alert' : 'info'"
          />
          <p>{{ toast.message }}</p>
          <button
            type="button"
            class="toast__close"
            (click)="toasts.dismiss(toast.id)"
            aria-label="Dismiss notification"
          >
            <app-icon name="close" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toasts {
      position: fixed;
      right: var(--sp-4);
      bottom: var(--sp-4);
      left: var(--sp-4);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--sp-3);
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: var(--sp-3);
      width: min(420px, 100%);
      padding: var(--sp-4);
      border-radius: var(--radius);
      background: var(--c-surface-3);
      border: 1px solid var(--c-border-strong);
      box-shadow: var(--shadow);
      animation: reveal var(--dur) var(--ease) both;
    }
    .toast--success app-icon {
      color: var(--c-success);
    }
    .toast--error app-icon {
      color: var(--c-danger);
    }
    .toast--info app-icon {
      color: var(--c-accent);
    }
    p {
      flex: 1;
      margin: 0;
      font-size: var(--fs-sm);
    }
    .toast__close {
      background: none;
      border: 0;
      color: var(--c-text-muted);
      padding: 2px;
    }
  `,
})
export class ToastOutlet {
  protected readonly toasts = inject(ToastService);
}
