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
        path: 'register',
        title: 'Registrarse',
        loadComponent: () => import('./pages/register/register-page.component').then(m => m.RegisterPageComponent)
      },
      {
        path: 'forgot-password',
        title: 'Recuperar Contraseña',
        loadComponent: () => import('./pages/forgot-password/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent)
      },
      {
        path: 'confirm-email',
        title: 'Confirmar Email',
        loadComponent: () => import('./pages/confirm-email/confirm-email-page.component').then(m => m.ConfirmEmailPageComponent)
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