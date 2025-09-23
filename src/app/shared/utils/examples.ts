/**
 * Ejemplos de uso de las utilidades compartidas
 * Este archivo es solo para referencia y documentación
 */

import { StorageUtils } from './index';

// Ejemplo 1: Obtener datos de autenticación
export function getAuthData() {
  const tenantId = StorageUtils.getTenantIdFromStorage();
  const userId = StorageUtils.getUserIdFromStorage();
  const token = StorageUtils.getAuthTokenFromStorage();

  return {
    tenantId,
    userId,
    token,
    isAuthenticated: !!(tenantId && userId && token)
  };
}

// Ejemplo 2: Configurar datos de sesión
export function setSessionData(tenantId: string, userId: string, token: string) {
  StorageUtils.setItem('tenantId', tenantId);
  StorageUtils.setItem('userId', userId);
  StorageUtils.setItem('token', token);
  
  // También guardar como objeto completo
  StorageUtils.setItem('userSession', {
    tenantId,
    userId,
    token,
    timestamp: new Date().toISOString()
  });
}

// Ejemplo 3: Limpiar sesión
export function clearSession() {
  StorageUtils.removeItem('tenantId');
  StorageUtils.removeItem('userId');
  StorageUtils.removeItem('token');
  StorageUtils.removeItem('userSession');
  StorageUtils.removeItem('currentTenant');
  StorageUtils.removeItem('authData');
}

// Ejemplo 4: Verificar disponibilidad de almacenamiento
export function checkStorageAvailability() {
  if (!StorageUtils.isAvailable()) {
    console.warn('localStorage no está disponible');
    return false;
  }
  return true;
}

// Ejemplo 5: Obtener configuración de usuario con fallback
export function getUserPreferences() {
  const defaultPreferences = {
    theme: 'light',
    language: 'es',
    notifications: true
  };

  return StorageUtils.getItem('userPreferences', defaultPreferences);
}

// Ejemplo 6: Guardar configuración de usuario
export function saveUserPreferences(preferences: any) {
  StorageUtils.setItem('userPreferences', {
    ...preferences,
    lastUpdated: new Date().toISOString()
  });
}
