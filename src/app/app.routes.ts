import { Routes } from '@angular/router';
import { guestOnlyGuard, roleGuard } from './core/auth/auth.guards';
import { PublicLayout } from './layout/public-layout';
import { lp } from './core/i18n/current-locale';

/**
 * Public paths are canonical (English) keys translated per language with `lp()` (see core/i18n/paths.ts),
 * e.g. 'services/:slug' is 'diensten/:slug' in the Dutch build. Client-only areas are not translated.
 *
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
        path: lp('about'),
        loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPage),
      },
      {
        path: lp('services'),
        loadComponent: () =>
          import('./features/services/services-page').then((m) => m.ServicesPage),
      },
      {
        path: lp('services/:slug'),
        loadComponent: () =>
          import('./features/services/service-detail-page').then((m) => m.ServiceDetailPage),
      },
      {
        path: lp('programs'),
        loadComponent: () =>
          import('./features/programs/programs-page').then((m) => m.ProgramsPage),
      },
      {
        path: lp('programs/:slug'),
        loadComponent: () =>
          import('./features/programs/program-detail-page').then((m) => m.ProgramDetailPage),
      },
      {
        path: lp('exercises'),
        loadComponent: () =>
          import('./features/exercises/exercise-library-page').then((m) => m.ExerciseLibraryPage),
      },
      {
        path: lp('exercises/:slug'),
        loadComponent: () =>
          import('./features/exercises/exercise-detail-page').then((m) => m.ExerciseDetailPage),
      },
      {
        path: lp('muscle-chart'),
        loadComponent: () =>
          import('./features/muscle-chart/muscle-chart-page').then((m) => m.MuscleChartPage),
      },
      {
        path: lp('workout-planner'),
        loadComponent: () =>
          import('./features/planner/workout-planner-page').then((m) => m.WorkoutPlannerPage),
      },
      {
        path: lp('nutrition'),
        loadComponent: () =>
          import('./features/nutrition/nutrition-page').then((m) => m.NutritionPage),
      },
      {
        path: lp('nutrition/calculators'),
        loadComponent: () =>
          import('./features/nutrition/calculators-page').then((m) => m.CalculatorsPage),
      },
      {
        path: lp('transformations'),
        loadComponent: () =>
          import('./features/transformations/transformations-page').then(
            (m) => m.TransformationsPage,
          ),
      },
      {
        path: lp('pricing'),
        loadComponent: () => import('./features/pricing/pricing-page').then((m) => m.PricingPage),
      },
      {
        path: lp('blog'),
        loadComponent: () => import('./features/blog/blog-page').then((m) => m.BlogPage),
      },
      {
        path: lp('blog/category/:category'),
        loadComponent: () => import('./features/blog/blog-page').then((m) => m.BlogPage),
      },
      {
        path: lp('blog/:slug'),
        loadComponent: () => import('./features/blog/article-page').then((m) => m.ArticlePage),
      },
      {
        path: lp('contact'),
        loadComponent: () => import('./features/contact/contact-page').then((m) => m.ContactPage),
      },
      {
        path: 'login',
        canActivate: [guestOnlyGuard],
        loadComponent: () => import('./features/auth/login-page').then((m) => m.LoginPage),
      },
      {
        path: lp('privacy'),
        data: { doc: 'privacy' },
        loadComponent: () => import('./features/legal/legal-page').then((m) => m.LegalPage),
      },
      {
        path: lp('terms'),
        data: { doc: 'terms' },
        loadComponent: () => import('./features/legal/legal-page').then((m) => m.LegalPage),
      },
      {
        path: lp('disclaimer'),
        data: { doc: 'disclaimer' },
        loadComponent: () => import('./features/legal/legal-page').then((m) => m.LegalPage),
      },

      // Friendly aliases — permanent redirects to canonical URLs.
      { path: lp('coaching'), redirectTo: lp('/services'), pathMatch: 'full' },
      { path: lp('plans'), redirectTo: lp('/pricing'), pathMatch: 'full' },
      { path: lp('anatomy'), redirectTo: lp('/muscle-chart'), pathMatch: 'full' },
      { path: lp('workout-chart'), redirectTo: lp('/muscle-chart'), pathMatch: 'full' },
      { path: lp('calculators'), redirectTo: lp('/nutrition/calculators'), pathMatch: 'full' },
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
