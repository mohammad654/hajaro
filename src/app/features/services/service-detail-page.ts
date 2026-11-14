import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PackageStore } from '../../core/data-access/package.store';
import { ProgramStore } from '../../core/data-access/program.store';
import { ServiceCatalogStore } from '../../core/data-access/service-catalog.store';
import { injectNotFoundStatus } from '../../core/seo/http-status';
import { serviceSchema } from '../../core/seo/schema.builders';
import { SeoService } from '../../core/seo/seo.service';
import { ProgramCard } from '../../shared/cards/program-card';
import { CtaSection } from '../../shared/ui/cta-section';
import { Icon } from '../../shared/ui/icon/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { NotFoundContent } from '../not-found/not-found-content';
import { DELIVERY_LABELS } from './services-page';

@Component({
  selector: 'app-service-detail-page',
  imports: [RouterLink, CurrencyPipe, PageHero, Icon, ProgramCard, CtaSection, NotFoundContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-detail-page.html',
  styleUrl: './service-detail-page.scss',
})
export class ServiceDetailPage {
  private readonly seo = inject(SeoService);
  private readonly services = inject(ServiceCatalogStore);
  private readonly programs = inject(ProgramStore);
  private readonly packages = inject(PackageStore);
  private readonly markNotFound = injectNotFoundStatus();

  readonly slug = input.required<string>();

  protected readonly deliveryLabels = DELIVERY_LABELS;
  protected readonly service = computed(() => this.services.bySlug(this.slug()));
  protected readonly relatedPackage = computed(() =>
    this.packages.get(this.service()?.relatedPackageId),
  );
  protected readonly relatedPrograms = computed(() =>
    (this.service()?.relatedProgramSlugs ?? [])
      .map((slug) => this.programs.bySlug(slug))
      .filter((p) => !!p),
  );
  protected readonly otherServices = computed(() =>
    this.services
      .all()
      .filter((s) => s.id !== this.service()?.id)
      .slice(0, 4),
  );

  constructor() {
    effect(() => {
      const service = this.service();
      if (!service) {
        this.markNotFound();
        this.seo.update({
          title: 'Service not found',
          description: 'This coaching service could not be found.',
          noindex: true,
        });
        return;
      }
      this.seo.update({
        title: `${service.name} — ${this.deliveryLabels[service.delivery]} Coaching`,
        description: service.shortDescription,
        path: `/services/${service.slug}`,
      });
      this.seo.setPageSchema(
        'service',
        serviceSchema((p) => this.seo.absoluteUrl(p), service),
      );
    });
  }
}
