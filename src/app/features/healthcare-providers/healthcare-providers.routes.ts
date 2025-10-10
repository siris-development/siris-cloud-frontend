import { Routes } from "@angular/router";
import { AuthenticatedLayoutComponent } from "@/shared/components/authenticated-layout/authenticated-layout.component";
import { HealthcareProvidersPageComponent } from "./pages/healthcare-providers-page.component";
import { HealthcareProviderConfigsPageComponent } from "./pages/components/healthcare-provider-configs-page/healthcare-provider-configs-page.component";

export const healthcareProvidersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => HealthcareProvidersPageComponent
      },
      {
        path: 'configs/:providerId',
        loadComponent: () => HealthcareProviderConfigsPageComponent
      }
    ]
  }
];
