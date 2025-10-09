import { Routes } from "@angular/router";
import { AuthenticatedLayoutComponent } from "@/shared/components/authenticated-layout/authenticated-layout.component";

export const usageRoutes: Routes = [
  {
    path: '',
    loadComponent: () => AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/usage-page.component').then(m => m.UsagePageComponent)
      }
    ]
  }
];
