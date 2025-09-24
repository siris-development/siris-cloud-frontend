import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { LOCAL_STORAGE_KEYS } from '../../../core/config/storage.config';

export const AuthenticatedGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const router = inject(Router);
  
  // Verificar si hay token en localStorage usando la clave correcta
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  if (!token) {
    console.log('[AuthenticatedGuard] No token found, redirecting to login');
    router.navigateByUrl('/auth/login');
    return false;
  }
  
  // Si hay token, permitir acceso (como funciona el dashboard)
  console.log('[AuthenticatedGuard] Token found, allowing access');
  return true;
};
