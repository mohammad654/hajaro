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
import { BILLING_PERIOD_LABELS, SERVICE_DELIVERY_LABELS } from '../../core/models';
import { canonicalSlug } from '../../core/i18n/current-locale';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-service-detail-page',
  imports: [
    LocalePathPipe,
    RouterLink,
    CurrencyPipe,
    PageHero,
    Icon,
    ProgramCard,
    CtaSection,
    NotFoundContent,
  ],
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

  protected readonly deliveryLabels = SERVICE_DELIVERY_LABELS;
  protected readonly periodLabels = BILLING_PERIOD_LABELS;
  protected readonly service = computed(() => this.services.bySlug(canonicalSlug(this.slug())));
  protected readonly relatedPackage = computed(() =>
    this.packages.get(this.service()?.relatedPackageId),
  );
  protected readonly relatedPrograms = computed(() =>
    (this.service()?.relatedProgramSlugs ?? [])
      .map((slug) => this.programs.bySlug(slug))
      .filter((p) => !!p),
  );
  protected readonly breadcrumbs = computed(() => {
    const service = this.service();
    return [
      { label: $localize`Services`, url: '/services' },
      ...(service ? [{ label: service.name, url: `/services/${service.slug}` }] : []),
    ];
  });
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
          title: $localize`Service not found`,
          description: $localize`This coaching service doesn't exist or has moved.`,
          noindex: true,
        });
        return;
      }
      this.seo.update({
        title: service.name,
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
