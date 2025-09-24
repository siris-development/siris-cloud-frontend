import { Routes } from "@angular/router";
import { AuthenticatedLayoutComponent } from "@/shared/components/authenticated-layout/authenticated-layout.component";
import { HomePageComponent } from "./pages/home-page.component";

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => HomePageComponent
      }
    ]
  }
];
