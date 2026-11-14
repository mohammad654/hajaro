import { Routes } from '@angular/router';
import { AdminShell } from './admin-shell';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminShell,
    children: [
      {
        path: '',
        title: 'Admin',
        loadComponent: () => import('./pages/admin-overview-page').then((m) => m.AdminOverviewPage),
      },
      {
        path: 'inquiries',
        title: 'Consultation requests',
        loadComponent: () => import('./pages/inquiries-page').then((m) => m.InquiriesPage),
      },
      {
        path: 'content',
        title: 'Site content & SEO',
        loadComponent: () => import('./pages/site-content-page').then((m) => m.SiteContentPage),
      },
      {
        path: 'clients/:id',
        title: 'Client',
        loadComponent: () => import('./pages/client-detail-page').then((m) => m.ClientDetailPage),
      },
      {
        path: 'programs/:id',
        title: 'Program editor',
        loadComponent: () => import('./pages/program-editor-page').then((m) => m.ProgramEditorPage),
      },
      // Generic resource management (exercises, packages, articles, results, bookings…)
      {
        path: ':resource',
        loadComponent: () => import('./pages/resource-list-page').then((m) => m.ResourceListPage),
      },
      {
        path: ':resource/:id',
        loadComponent: () => import('./pages/resource-edit-page').then((m) => m.ResourceEditPage),
      },
    ],
  },
];
