import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './features/auth/guards/not-authenticated.guard';
import { AuthenticatedGuard } from './features/auth/guards/authenticated.guard';
import { AuthenticatedLayoutComponent } from './shared/components/authenticated-layout/authenticated-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
    canMatch: [NotAuthenticatedGuard],
  },
  {
    path: '',
    loadChildren: () => import('./features/landing/landing.routes').then(m => m.landingRoutes),
  },
  {

    path: 'dashboard',
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  {
    path: 'whatsapp',
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./features/whatsapp/whatsapp.routes').then((m) => m.whatsappRoutes),
  },
  {
    path: 'payment',
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./features/payment/payment.routes').then((m) => m.paymentRoutes),
  },
  {
    path: 'healthcare-providers',
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./features/healthcare-providers/healthcare-providers.routes').then((m) => m.healthcareProvidersRoutes),
  },
  {
    path: 'external-ips',
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./features/external-ips/external-ips.routes').then((m) => m.externalIpsRoutes),
  },

  
];
