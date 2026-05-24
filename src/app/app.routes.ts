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
        path: 'employees/ad-users',
        loadComponent: () =>
          import('./features/employees/ui/pages/ad-users/ad-users.component')
            .then((m) => m.ADUsersComponent),
      },
      {
        path: 'employees/departments',
        loadComponent: () =>
          import('./features/employees/ui/pages/departments/departments.component')
            .then((m) => m.DepartmentsComponent),
      },
      {
        path: 'employees/contacts',
        loadComponent: () =>
          import('./features/employees/ui/pages/contacts/contacts.component')
            .then((m) => m.ContactsComponent),
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
