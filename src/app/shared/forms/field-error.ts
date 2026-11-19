import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
  OnInit,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { validationMessage } from './validation-messages';
import { Icon } from '../ui/icon/icon';

/**
 * Displays the first validation error for a control once it has been touched.
 * Linked to the input via `aria-describedby="{{ id }}"` for screen-reader users.
 */
@Component({
  selector: 'app-field-error',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message(); as text) {
      <span class="field__error" [id]="id()" role="alert"
        ><app-icon name="alert" [size]="14" />{{ text }}</span
      >
    }
  `,
})
export class FieldError implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly control = input.required<AbstractControl>();
  readonly id = input.required<string>();
  readonly label = input($localize`This field`);

  protected readonly message = signal<string | null>(null);

  ngOnInit(): void {
    const control = this.control();
    merge(control.statusChanges, control.events)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.update());
    this.update();
  }

  private update(): void {
    const control = this.control();
    this.message.set(
      control.invalid && (control.touched || control.dirty)
        ? validationMessage(control.errors, this.label())
        : null,
    );
  }
}
