import { Routes } from "@angular/router";
import { AuthenticatedLayoutComponent } from "@/shared/components/authenticated-layout/authenticated-layout.component";

export const whatsappRoutes: Routes = [
  {
    path: '',
    loadComponent: () => AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/whatsapp-page.component').then(m => m.WhatsAppPageComponent)
      }
    ]
  }
];
