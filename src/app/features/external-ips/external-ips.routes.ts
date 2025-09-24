import { Routes } from "@angular/router";
import { AuthenticatedLayoutComponent } from "@/shared/components/authenticated-layout/authenticated-layout.component";
import { ExternalIpsPageComponent } from "./pages/external-ips-page.component";

export const externalIpsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => ExternalIpsPageComponent
      }
    ]
  }
];
