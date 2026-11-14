import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldError } from '../../../shared/forms/field-error';
import { FieldDef } from './schema-form';

let fieldsInstance = 0;

/** Renders a set of schema-defined fields bound to a FormGroup. */
@Component({
  selector: 'app-schema-fields',
  imports: [ReactiveFormsModule, FieldError],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-grid" [formGroup]="group()">
      @for (field of fields(); track field.key) {
        @let id = prefix + field.key;
        @switch (field.type) {
          @case ('checkbox') {
            <div class="field" [class.span-2]="field.wide">
              <label class="checkbox">
                <input type="checkbox" [id]="id" [formControlName]="field.key" />
                <span>{{ field.label }}</span>
              </label>
              @if (field.hint) {
                <span class="field__hint">{{ field.hint }}</span>
              }
              <app-field-error
                [control]="control(field)"
                [id]="id + '-err'"
                [label]="field.label"
              />
            </div>
          }
          @case ('multiselect') {
            <fieldset class="field span-2">
              <legend class="field__label">{{ field.label }}</legend>
              <div class="multi">
                @for (o of field.options ?? []; track o.value) {
                  <label class="checkbox">
                    <input
                      type="checkbox"
                      [checked]="isSelected(field, o.value)"
                      (change)="toggle(field, o.value, $event)"
                    />
                    <span>{{ o.label }}</span>
                  </label>
                }
              </div>
              @if (field.hint) {
                <span class="field__hint">{{ field.hint }}</span>
              }
            </fieldset>
          }
          @default {
            <div
              class="field"
              [class.span-2]="field.wide || field.type === 'textarea' || field.type === 'lines'"
            >
              <label [for]="id">{{ field.label }}{{ field.required ? ' *' : '' }}</label>
              @switch (field.type) {
                @case ('textarea') {
                  <textarea
                    [id]="id"
                    class="textarea"
                    [formControlName]="field.key"
                    [rows]="field.rows ?? 5"
                    [attr.maxlength]="field.maxLength ?? null"
                    [attr.aria-describedby]="id + '-err'"
                  ></textarea>
                }
                @case ('lines') {
                  <textarea
                    [id]="id"
                    class="textarea"
                    [formControlName]="field.key"
                    [rows]="field.rows ?? 4"
                    [attr.aria-describedby]="id + '-hint ' + id + '-err'"
                  ></textarea>
                }
                @case ('select') {
                  <select [id]="id" class="select" [formControlName]="field.key">
                    @if (!field.required) {
                      <option value="">—</option>
                    }
                    @for (o of field.options ?? []; track o.value) {
                      <option [value]="o.value">{{ o.label }}</option>
                    }
                  </select>
                }
                @case ('number') {
                  <input
                    [id]="id"
                    class="input"
                    type="number"
                    [formControlName]="field.key"
                    [attr.min]="field.min ?? null"
                    [attr.max]="field.max ?? null"
                    [attr.step]="field.step ?? 1"
                    [attr.aria-describedby]="id + '-err'"
                  />
                }
                @case ('date') {
                  <input [id]="id" class="input" type="date" [formControlName]="field.key" />
                }
                @case ('datetime') {
                  <input
                    [id]="id"
                    class="input"
                    type="datetime-local"
                    [formControlName]="field.key"
                  />
                }
                @default {
                  <input
                    [id]="id"
                    class="input"
                    [type]="
                      field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'
                    "
                    [formControlName]="field.key"
                    [attr.maxlength]="field.maxLength ?? null"
                    [attr.aria-describedby]="id + '-err'"
                  />
                }
              }
              @if (field.type === 'lines') {
                <span class="field__hint" [id]="id + '-hint'"
                  >One item per line.{{ field.hint ? ' ' + field.hint : '' }}</span
                >
              } @else if (field.hint) {
                <span class="field__hint">{{ field.hint }}</span>
              }
              <app-field-error
                [control]="control(field)"
                [id]="id + '-err'"
                [label]="field.label"
              />
            </div>
          }
        }
      }
    </div>
  `,
  styles: `
    fieldset {
      border: 0;
      padding: 0;
      margin: 0;
    }
    .multi {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
      gap: var(--sp-2);
    }
  `,
})
export class SchemaFields {
  readonly group = input.required<FormGroup>();
  readonly fields = input.required<readonly FieldDef[]>();
  protected readonly prefix = `sf${++fieldsInstance}-`;

  protected control(field: FieldDef): FormControl {
    return this.group().controls[field.key] as FormControl;
  }

  protected isSelected(field: FieldDef, value: string): boolean {
    return (this.control(field).value as string[]).includes(value);
  }

  protected toggle(field: FieldDef, value: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const control = this.control(field);
    const current = control.value as string[];
    control.setValue(checked ? [...current, value] : current.filter((v) => v !== value));
    control.markAsDirty();
  }
}
