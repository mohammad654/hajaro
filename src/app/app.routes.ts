import { Routes } from '@angular/router';
import { guestOnlyGuard, roleGuard } from './core/auth/auth.guards';
import { PublicLayout } from './layout/public-layout';

/**
 * Every feature is lazy-loaded. Public pages share the PublicLayout (header + footer);
 * the client dashboard and admin areas have their own application shells.
 */
export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage),
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPage),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/services/services-page').then((m) => m.ServicesPage),
      },
      {
        path: 'services/:slug',
        loadComponent: () =>
          import('./features/services/service-detail-page').then((m) => m.ServiceDetailPage),
      },
      {
        path: 'programs',
        loadComponent: () =>
          import('./features/programs/programs-page').then((m) => m.ProgramsPage),
      },
      {
        path: 'programs/:slug',
        loadComponent: () =>
          import('./features/programs/program-detail-page').then((m) => m.ProgramDetailPage),
      },
      {
        path: 'exercises',
        loadComponent: () =>
          import('./features/exercises/exercise-library-page').then((m) => m.ExerciseLibraryPage),
      },
      {
        path: 'exercises/:slug',
        loadComponent: () =>
          import('./features/exercises/exercise-detail-page').then((m) => m.ExerciseDetailPage),
      },
      {
        path: 'muscle-chart',
        loadComponent: () =>
          import('./features/muscle-chart/muscle-chart-page').then((m) => m.MuscleChartPage),
      },
      {
        path: 'workout-planner',
        loadComponent: () =>
          import('./features/planner/workout-planner-page').then((m) => m.WorkoutPlannerPage),
      },
      {
        path: 'nutrition',
        loadComponent: () =>
          import('./features/nutrition/nutrition-page').then((m) => m.NutritionPage),
      },
      {
        path: 'nutrition/calculators',
        loadComponent: () =>
          import('./features/nutrition/calculators-page').then((m) => m.CalculatorsPage),
      },
      {
        path: 'transformations',
        loadComponent: () =>
          import('./features/transformations/transformations-page').then(
            (m) => m.TransformationsPage,
          ),
      },
      {
        path: 'pricing',
        loadComponent: () => import('./features/pricing/pricing-page').then((m) => m.PricingPage),
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/blog/blog-page').then((m) => m.BlogPage),
      },
      {
        path: 'blog/category/:category',
        loadComponent: () => import('./features/blog/blog-page').then((m) => m.BlogPage),
      },
      {
        path: 'blog/:slug',
        loadComponent: () => import('./features/blog/article-page').then((m) => m.ArticlePage),
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact-page').then((m) => m.ContactPage),
      },
      {
        path: 'login',
        canActivate: [guestOnlyGuard],
        loadComponent: () => import('./features/auth/login-page').then((m) => m.LoginPage),
      },
      {
        path: 'privacy',
        data: { doc: 'privacy' },
        loadComponent: () => import('./features/legal/legal-page').then((m) => m.LegalPage),
      },
      {
        path: 'terms',
        data: { doc: 'terms' },
        loadComponent: () => import('./features/legal/legal-page').then((m) => m.LegalPage),
      },
      {
        path: 'disclaimer',
        data: { doc: 'disclaimer' },
        loadComponent: () => import('./features/legal/legal-page').then((m) => m.LegalPage),
      },

      // Friendly aliases — permanent redirects to canonical URLs.
      { path: 'coaching', redirectTo: 'services', pathMatch: 'full' },
      { path: 'plans', redirectTo: 'pricing', pathMatch: 'full' },
      { path: 'anatomy', redirectTo: 'muscle-chart', pathMatch: 'full' },
      { path: 'workout-chart', redirectTo: 'muscle-chart', pathMatch: 'full' },
      { path: 'calculators', redirectTo: 'nutrition/calculators', pathMatch: 'full' },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [roleGuard('client')],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [roleGuard('admin')],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/not-found/not-found-page').then((m) => m.NotFoundPage),
      },
    ],
  },
];
