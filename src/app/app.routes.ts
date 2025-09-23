import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
    canMatch: [
      NotAuthenticatedGuard
    ],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes),
  },
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing-page.component').then(m => m.LandingPageComponent),
  }
];
