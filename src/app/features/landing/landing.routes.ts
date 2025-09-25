import { Routes } from "@angular/router";

export const landingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing-page.component').then(m => m.LandingPageComponent)
  }
];
