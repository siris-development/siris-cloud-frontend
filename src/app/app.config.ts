import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { loggingInterceptor } from './shared/components/interceptors/logging.interceptor';
import { authInterceptor } from './auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withViewTransitions({
        skipInitialTransition: true,
      })
    ),
    provideHttpClient(withFetch(), withInterceptors([loggingInterceptor, authInterceptor])),
  ],
};
