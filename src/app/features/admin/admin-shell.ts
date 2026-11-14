import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';
import { PortalNavItem, PortalShell } from '../../layout/portal-shell/portal-shell';
import { ADMIN_RESOURCES } from './resources/resource.registry';

@Component({
  selector: 'app-admin-shell',
  imports: [PortalShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-portal-shell title="Coach admin" [nav]="nav" />`,
})
export class AdminShell {
  protected readonly nav: readonly PortalNavItem[] = [
    { label: 'Overview', path: '/admin', icon: 'chart', exact: true },
    { label: 'Consultation requests', path: '/admin/inquiries', icon: 'mail' },
    ...ADMIN_RESOURCES.map((r) => ({ label: r.plural, path: `/admin/${r.key}`, icon: r.icon })),
    { label: 'Site content & SEO', path: '/admin/content', icon: 'settings' },
  ];

  constructor() {
    inject(SeoService).update({
      title: 'Coach admin',
      description: 'Administration dashboard.',
      noindex: true,
    });
  }
}
