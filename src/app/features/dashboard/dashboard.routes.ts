import { Routes } from '@angular/router';
import { DashboardShell } from './dashboard-shell';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardShell,
    children: [
      {
        path: '',
        title: 'Dashboard',
        loadComponent: () => import('./pages/overview-page').then((m) => m.OverviewPage),
      },
      {
        path: 'training',
        title: 'My training',
        loadComponent: () => import('./pages/training-page').then((m) => m.TrainingPage),
      },
      {
        path: 'workouts',
        title: 'Workout log',
        loadComponent: () => import('./pages/workouts-page').then((m) => m.WorkoutsPage),
      },
      {
        path: 'progress',
        title: 'Progress',
        loadComponent: () => import('./pages/progress-page').then((m) => m.ProgressPage),
      },
      {
        path: 'nutrition',
        title: 'Nutrition',
        loadComponent: () =>
          import('./pages/nutrition-targets-page').then((m) => m.NutritionTargetsPage),
      },
      {
        path: 'check-ins',
        title: 'Check-ins',
        loadComponent: () => import('./pages/check-ins-page').then((m) => m.CheckInsPage),
      },
      {
        path: 'appointments',
        title: 'Appointments',
        loadComponent: () => import('./pages/appointments-page').then((m) => m.AppointmentsPage),
      },
      {
        path: 'notifications',
        title: 'Notifications',
        loadComponent: () => import('./pages/notifications-page').then((m) => m.NotificationsPage),
      },
      {
        path: 'profile',
        title: 'Profile',
        loadComponent: () => import('./pages/profile-page').then((m) => m.ProfilePage),
      },
    ],
  },
];
