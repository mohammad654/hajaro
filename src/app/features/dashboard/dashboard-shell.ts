import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';
import { PortalNavItem, PortalShell } from '../../layout/portal-shell/portal-shell';

@Component({
  selector: 'app-dashboard-shell',
  imports: [PortalShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-portal-shell title="Client dashboard" [nav]="nav" />`,
})
export class DashboardShell {
  protected readonly nav: readonly PortalNavItem[] = [
    { label: 'Overview', path: '/dashboard', icon: 'home', exact: true },
    { label: 'My training', path: '/dashboard/training', icon: 'dumbbell' },
    { label: 'Workout log', path: '/dashboard/workouts', icon: 'clipboard' },
    { label: 'Progress', path: '/dashboard/progress', icon: 'chart' },
    { label: 'Nutrition', path: '/dashboard/nutrition', icon: 'pie' },
    { label: 'Check-ins', path: '/dashboard/check-ins', icon: 'message' },
    { label: 'Appointments', path: '/dashboard/appointments', icon: 'calendar' },
    { label: 'Notifications', path: '/dashboard/notifications', icon: 'bell' },
    { label: 'Profile', path: '/dashboard/profile', icon: 'user' },
  ];

  constructor() {
    inject(SeoService).update({
      title: 'Client dashboard',
      description: 'Your private coaching dashboard.',
      noindex: true,
    });
  }
}
