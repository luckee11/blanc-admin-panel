import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './features/auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/ui/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/ui/pages/dashboard-page/dashboard-page.component')
            .then((m) => m.DashboardPageComponent),
      },

      /* ===== Employees ===== */
      { path: 'employees', pathMatch: 'full', redirectTo: 'employees/employed' },
      {
        path: 'employees/employed',
        loadComponent: () =>
          import('./features/employees/ui/pages/employed/employed.component')
            .then((m) => m.EmployedComponent),
      },
      {
        path: 'employees/employed/:id',
        loadComponent: () =>
          import('./features/employees/ui/pages/human-detail/human-detail.component')
            .then((m) => m.HumanDetailComponent),
      },
      {
        path: 'employees/departments',
        loadComponent: () =>
          import('./features/employees/ui/pages/departments/departments.component')
            .then((m) => m.DepartmentsComponent),
      },

      /* ===== IPR ===== */
      { path: 'ipr', pathMatch: 'full', redirectTo: 'ipr/plans' },
      {
        path: 'ipr/plans',
        loadComponent: () =>
          import('./features/ipr/ui/pages/plans/plans.component')
            .then((m) => m.PlansComponent),
      },
      {
        path: 'ipr/plans/:id',
        loadComponent: () =>
          import('./features/ipr/ui/pages/plan-detail/plan-detail.component')
            .then((m) => m.PlanDetailComponent),
      },
      {
        path: 'ipr/analytics',
        loadComponent: () =>
          import('./features/ipr/ui/pages/analytics/analytics.component')
            .then((m) => m.AnalyticsComponent),
      },
      {
        path: 'ipr/analytics/group/:groupId',
        loadComponent: () =>
          import('./features/ipr/ui/pages/group-analytics/group-analytics.component')
            .then((m) => m.GroupAnalyticsComponent),
      },
      {
        path: 'ipr/tasks',
        loadComponent: () =>
          import('./features/ipr/ui/pages/tasks/tasks.component')
            .then((m) => m.TasksComponent),
      },

      /* ===== Surveys / Roles / News / Emails ===== */
      {
        path: 'surveys',
        loadComponent: () =>
          import('./features/surveys/ui/pages/surveys-page/surveys-page.component')
            .then((m) => m.SurveysPageComponent),
      },
      {
        path: 'performance-review',
        loadComponent: () =>
          import('./features/performance-review/ui/pages/performance-review-page/performance-review-page.component')
            .then((m) => m.PerformanceReviewPageComponent),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./features/roles/ui/pages/roles-page/roles-page.component')
            .then((m) => m.RolesPageComponent),
      },
      {
        path: 'news',
        loadComponent: () =>
          import('./features/news/ui/pages/news-page/news-page.component')
            .then((m) => m.NewsPageComponent),
      },
      {
        path: 'emails',
        loadComponent: () =>
          import('./features/emails/ui/pages/emails-page/emails-page.component')
            .then((m) => m.EmailsPageComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
