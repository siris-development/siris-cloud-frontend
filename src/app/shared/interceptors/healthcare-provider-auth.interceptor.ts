import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '@/features';


/**
 * Interceptor específico para peticiones de Proveedores de Servicios de Salud
 * Agrega automáticamente el token de autorización a las peticiones
 */
export function healthcareProviderAuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  // Verificar si la petición es para healthcare-providers
  if (isHealthcareProviderRequest(req.url)) {
    const authService = inject(AuthService);
    const token = authService.token();
    
    if (token) {
      // Clonar la petición y agregar el header de autorización
      const authReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return next(authReq);
    }
  }
  
  // Si no es una petición de healthcare-providers o no hay token, continuar sin modificar
  return next(req);
}

/**
 * Verifica si la URL corresponde a una petición de healthcare-providers
 */
function isHealthcareProviderRequest(url: string): boolean {
  // Patrones de URL que corresponden a healthcare-providers
  const healthcareProviderPatterns = [
    '/healthcare-providers',
    '/pt/',  // Para compatibilidad con endpoints legacy
    '/pt-ms' // Para configuraciones de microservicios
  ];
  
  return healthcareProviderPatterns.some(pattern => url.includes(pattern));
}
