import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EntityStore } from '../../../core/data-access/entity-store';
import { Entity } from '../../../core/models';
import { ToastService } from '../../../core/services/toast.service';
import { NotFoundContent } from '../../not-found/not-found-content';
import { SchemaFields } from '../forms/schema-fields';
import { buildSchemaGroup, readSchemaGroup } from '../forms/schema-form';
import { findResource } from '../resources/resource.registry';

/** Generic create/edit page driven by the resource registry. */
@Component({
  selector: 'app-resource-edit-page',
  imports: [ReactiveFormsModule, RouterLink, SchemaFields, NotFoundContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (config(); as cfg) {
      @if (form(); as f) {
        <header class="page-head">
          <a [routerLink]="'/admin/' + cfg.key" class="link-arrow back"
            >Back to {{ cfg.plural.toLowerCase() }}</a
          >
          <h1>
            {{
              isNew() ? 'New ' + cfg.singular.toLowerCase() : 'Edit ' + cfg.singular.toLowerCase()
            }}
          </h1>
        </header>
        <form [formGroup]="f" (ngSubmit)="save()" novalidate class="card">
          <app-schema-fields [group]="f" [fields]="cfg.fields" />
          @if (f.invalid && submitted()) {
            <p class="alert alert--danger" role="alert">Please correct the highlighted fields.</p>
          }
          <div class="form-actions">
            <a class="btn btn--ghost" [routerLink]="'/admin/' + cfg.key">Cancel</a>
            <button type="submit" class="btn btn--primary" [disabled]="saving()">
              @if (saving()) {
                <span class="spinner" aria-hidden="true"></span>
              }
              Save {{ cfg.singular.toLowerCase() }}
            </button>
          </div>
        </form>
      } @else {
        <app-not-found-content
          [heading]="'This ' + cfg.singular.toLowerCase() + ' does not exist'"
          [backLink]="'/admin/' + cfg.key"
          backLabel="Back to list"
        />
      }
    } @else {
      <app-not-found-content
        heading="This admin section doesn't exist"
        backLink="/admin"
        backLabel="Admin overview"
      />
    }
  `,
  styleUrl: '../../dashboard/pages/dashboard-pages.scss',
  styles: `
    .back {
      display: inline-flex;
      margin-bottom: var(--sp-3);
      flex-direction: row-reverse;
    }
  `,
})
export class ResourceEditPage {
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly resource = input.required<string>();
  readonly id = input.required<string>();

  protected readonly saving = signal(false);
  protected readonly submitted = signal(false);
  protected readonly isNew = computed(() => this.id() === 'new');
  protected readonly config = computed(() => findResource(this.resource()));
  private readonly store = computed<EntityStore<Entity> | undefined>(() => {
    const cfg = this.config();
    return cfg ? this.injector.get(cfg.store) : undefined;
  });
  private readonly existing = computed(() =>
    this.isNew() ? undefined : this.store()?.get(this.id()),
  );

  /** Rebuilt when the route or the underlying record changes (e.g. once stored data has loaded). */
  protected readonly form = computed<FormGroup | null>(() => {
    const cfg = this.config();
    if (!cfg) return null;
    const existing = this.existing();
    if (!this.isNew() && !existing) return null;
    return buildSchemaGroup(cfg.fields, existing ? cfg.toForm(existing) : cfg.blank());
  });

  protected save(): void {
    const cfg = this.config();
    const form = this.form();
    const store = this.store();
    this.submitted.set(true);
    if (!cfg || !form || !store) return;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    const entity = cfg.fromForm(readSchemaGroup(cfg.fields, form), this.existing());
    if (this.isNew() && store.get(entity.id)) {
      this.toast.error(`A ${cfg.singular.toLowerCase()} with this name/slug already exists.`);
      return;
    }
    this.saving.set(true);
    store
      .save(entity, this.isNew())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(`${cfg.singular} saved.`);
          void this.router.navigate(['/admin', cfg.key]);
        },
        error: (e: Error) => this.toast.error(e.message),
      });
  }
}
