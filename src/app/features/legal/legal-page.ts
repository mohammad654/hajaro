import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SeoService } from '../../core/seo/seo.service';
import { PageHero } from '../../shared/ui/page-hero';
import { LEGAL_DOCUMENTS } from './legal-content';

@Component({
  selector: 'app-legal-page',
  imports: [DatePipe, PageHero],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      i18n-eyebrow
      eyebrow="Legal"
      [title]="document().title"
      [lead]="document().intro"
      [breadcrumbs]="breadcrumbs()"
    />
    <section class="section">
      <div class="container container--narrow prose">
        <p class="text-small text-muted">
          <ng-container i18n>Last updated:</ng-container>
          <time [attr.datetime]="document().updated">{{
            document().updated | date: 'longDate'
          }}</time>
        </p>
        @for (section of document().sections; track section.heading) {
          <h2>{{ section.heading }}</h2>
          @for (paragraph of section.paragraphs; track $index) {
            <p>{{ paragraph }}</p>
          }
        }
      </div>
    </section>
  `,
})
export class LegalPage {
  private readonly seo = inject(SeoService);
  /** Bound from route data. */
  readonly doc = input.required<'privacy' | 'terms' | 'disclaimer'>();
  protected readonly document = computed(() => LEGAL_DOCUMENTS[this.doc()]);
  protected readonly breadcrumbs = computed(() => [
    { label: this.document().title, url: `/${this.doc()}` },
  ]);

  constructor() {
    effect(() =>
      this.seo.update({ title: this.document().title, description: this.document().description }),
    );
  }
}
