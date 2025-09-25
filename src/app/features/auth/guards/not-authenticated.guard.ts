import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';

 export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
 ) => {
  const authService = inject(AuthService)
  const router = inject(Router);
  
  console.log('[NotAuthenticatedGuard] Checking authentication status');
  
  // Verificar el estado de autenticación usando signals
  const authStatus = authService.authStatus();
  const user = authService.user();
  
  console.log('[NotAuthenticatedGuard] Auth status:', authStatus, 'User:', user?.email);
  
  // Si está autenticado, redirigir a la landing page
  if (authStatus === 'authenticated' && user) {
    console.log('[NotAuthenticatedGuard] User is authenticated, redirecting to home');
    router.navigateByUrl('/');
    return false;
  }
  
  // Si no está autenticado, permitir acceso a las rutas de auth
  console.log('[NotAuthenticatedGuard] User not authenticated, allowing access to auth routes');
  return true;
};
