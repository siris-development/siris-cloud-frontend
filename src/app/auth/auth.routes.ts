import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login-page.component').then(m => m.LoginPageComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register-page.component').then(m => m.RegisterPageComponent),
      },
      {
        path: 'confirm-email',
        loadComponent: () => import('./pages/confirm-email/confirm-email-page.component').then(m => m.ConfirmEmailPageComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./pages/forgot-password/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent),
      },
      {
        path: 'resend-confirmation',
        loadComponent: () => import('./pages/resend-confirmation/resend-confirmation-page.component').then(m => m.ResendConfirmationPageComponent),
      },
      {
        path: '**',
        redirectTo: 'login',
      }
    ]
  },

];
