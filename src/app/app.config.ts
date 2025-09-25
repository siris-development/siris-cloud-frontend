import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './features/auth/interceptors/auth.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { healthcareProviderAuthInterceptor } from './shared/interceptors/healthcare-provider-auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withViewTransitions({
        skipInitialTransition: true,
      })
    ),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor, authInterceptor, healthcareProviderAuthInterceptor])),
  ],
};
