import { Routes } from "@angular/router";

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        title: 'Inicio',
        loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
      },
      {
        path: 'encriptado',
        title: 'Encriptado',
        loadComponent: () => import('./pages/encriptado-page/encriptado-page.component').then(m => m.EncriptadoPageComponent)
      },
      {
        path: 'payment',
        title: 'Pagos',
        loadComponent: () => import('./pages/payment-page/payment-page.component').then(m => m.PaymentPageComponent)
      },
      {
        path: 'whatsapp',
        title: 'WhatsApp',
        loadComponent: () => import('./pages/whatsapp-page/whatsapp-page.component').then(m => m.WhatsAppPageComponent)
      },
      {
        path: '**',
        loadComponent: () => import('./pages/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent)
      }

    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];
