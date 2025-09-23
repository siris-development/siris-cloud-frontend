import { HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
  path?: string;
  method?: string;
  timestamp?: string;
}

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado';
        
        // Verificar si es un error 401 (No autorizado) y si el token ha expirado
        if (error.status === 401) {
          const errorText = error.error?.message || error.error?.error || error.message || '';
          
          // Detectar si el token ha expirado
          if (isTokenExpired(errorText)) {
            handleTokenExpiration();
            errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          } else {
            errorMessage = 'No autorizado';
          }
        } else if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          if (error.error && typeof error.error === 'object') {
            // Si el backend devuelve un objeto con estructura específica
            if (error.error.message) {
              errorMessage = cleanErrorMessage(error.error.message);
            } else if (error.error.error) {
              errorMessage = cleanErrorMessage(error.error.error);
            }
          } else if (typeof error.error === 'string') {
            // Si el backend devuelve un string
            errorMessage = cleanErrorMessage(error.error);
          } else {
            // Mensajes por defecto según el código de estado
            switch (error.status) {
              case 400:
                errorMessage = 'Solicitud incorrecta';
                break;
              case 403:
                errorMessage = 'Acceso denegado';
                break;
              case 404:
                errorMessage = 'Recurso no encontrado';
                break;
              case 409:
                errorMessage = 'Conflicto en la solicitud';
                break;
              case 422:
                errorMessage = 'Datos de entrada inválidos';
                break;
              case 500:
                errorMessage = 'Error interno del servidor';
                break;
              default:
                errorMessage = `Error ${error.status}: ${error.statusText}`;
            }
          }
        }

        // Crear un error personalizado con el mensaje del backend
        const customError = new Error(errorMessage);
        (customError as any).originalError = error;
        (customError as any).apiError = extractApiError(error);

        return throwError(() => customError);
      })
    );
  }

function cleanErrorMessage(message: string): string {
  if (!message) return 'Ha ocurrido un error inesperado';

  // Limpiar mensajes de error comunes del backend
  let cleanMessage = message;

  // Remover prefijos técnicos
  cleanMessage = cleanMessage.replace(/^Error en el login:\s*/i, '');
  cleanMessage = cleanMessage.replace(/^Error en el registro:\s*/i, '');
  cleanMessage = cleanMessage.replace(/^Error:\s*/i, '');
  cleanMessage = cleanMessage.replace(/^Exception:\s*/i, '');

  // Traducir mensajes técnicos a mensajes más amigables
  const errorTranslations: { [key: string]: string } = {
    'Email not confirmed': 'Tu correo electrónico no ha sido confirmado. Por favor, revisa tu bandeja de entrada y haz clic en el enlace de confirmación.',
    'Invalid credentials': 'Las credenciales ingresadas son incorrectas. Verifica tu email y contraseña.',
    'User not found': 'No se encontró una cuenta con este correo electrónico.',
    'Password too weak': 'La contraseña no cumple con los requisitos de seguridad.',
    'Email already exists': 'Ya existe una cuenta con este correo electrónico.',
    'Token expired': 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    'Account locked': 'Tu cuenta ha sido bloqueada. Contacta al administrador.',
    'Too many attempts': 'Demasiados intentos fallidos. Intenta nuevamente en unos minutos.',
    'Network error': 'Error de conexión. Verifica tu conexión a internet.',
    'Server error': 'Error del servidor. Intenta nuevamente más tarde.',
    'Unauthorized': 'No tienes permisos para realizar esta acción.',
    'Forbidden': 'Acceso denegado.',
    'Not found': 'El recurso solicitado no fue encontrado.',
    'Bad request': 'La solicitud contiene información incorrecta.',
    'Conflict': 'Ya existe un recurso con esta información.',
    'Unprocessable entity': 'Los datos proporcionados no son válidos.'
  };

  // Buscar traducción exacta
  if (errorTranslations[cleanMessage]) {
    return errorTranslations[cleanMessage];
  }

  // Buscar traducción parcial (case insensitive)
  const lowerMessage = cleanMessage.toLowerCase();
  for (const [key, value] of Object.entries(errorTranslations)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Si no hay traducción, capitalizar la primera letra y agregar punto si no lo tiene
  cleanMessage = cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
  if (!cleanMessage.endsWith('.') && !cleanMessage.endsWith('!') && !cleanMessage.endsWith('?')) {
    cleanMessage += '.';
  }

  return cleanMessage;
}

function extractApiError(error: HttpErrorResponse): ApiError | null {
  if (error.error && typeof error.error === 'object') {
    return {
      message: error.error.message || error.message,
      error: error.error.error || error.statusText,
      statusCode: error.status,
      path: error.url || undefined,
      method: error.error.method || undefined,
      timestamp: error.error.timestamp || new Date().toISOString()
    };
  }
  return null;
}

/**
 * Detecta si el error indica que el token ha expirado
 */
function isTokenExpired(errorText: string): boolean {
  if (!errorText) return false;
  
  const lowerErrorText = errorText.toLowerCase();
  
  // Patrones comunes que indican token expirado
  const expiredPatterns = [
    'token is expired',
    'token expired',
    'jwt expired',
    'token has expired',
    'invalid jwt',
    'unable to parse or verify signature',
    'token has invalid claims',
    'expired token',
    'token expirado',
    'sesión expirada'
  ];
  
  return expiredPatterns.some(pattern => lowerErrorText.includes(pattern));
}

/**
 * Maneja la expiración del token cerrando sesión y redirigiendo al login
 */
function handleTokenExpiration(): void {
  try {
    // Obtener servicios usando inject
    const router = inject(Router);
    const authService = inject(AuthService);
    
    // Cerrar sesión
    authService.logout();
    
    // Redirigir al login
    router.navigate(['/auth/login']);
    
    // Mostrar mensaje al usuario
    console.warn('Sesión expirada. Redirigiendo al login...');
    
  } catch (error) {
    console.error('Error al manejar expiración del token:', error);
    // Fallback: limpiar localStorage y recargar la página
    localStorage.clear();
    window.location.href = '/auth/login';
  }
}
