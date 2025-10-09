import { Routes } from "@angular/router";

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        title: 'Iniciar Sesión',
        loadComponent: () => import('./pages/login/login-page.component').then(m => m.LoginPageComponent)
      },
      {
        path: 'two-factor-registration',
        title: 'Registro de Dos Factores',
        loadComponent: () => import('./pages/two-factor-registration/two-factor-registration-page.component').then(m => m.TwoFactorRegistrationPageComponent)
      },
      {
        path: 'two-factor-confirmation',
        title: 'Confirmación de Dos Factores',
        loadComponent: () => import('./pages/two-factor-confirmation/two-factor-confirmation-page.component').then(m => m.TwoFactorConfirmationPageComponent)
      },
      {
        path: 'forgot-password',
        title: 'Recuperar Contraseña',
        loadComponent: () => import('./pages/forgot-password/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent)
      },
      {
        path: 'resend-confirmation',
        title: 'Reenviar Confirmación',
        loadComponent: () => import('./pages/resend-confirmation/resend-confirmation-page.component').then(m => m.ResendConfirmationPageComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];