/**
 * Configuración centralizada para las claves de almacenamiento local
 * 
 * Este archivo centraliza todas las claves utilizadas en localStorage, sessionStorage
 * y otros mecanismos de almacenamiento del navegador para la aplicación SirisCloud.
 * 
 * Beneficios:
 * - Centralización: Todas las claves en un solo lugar
 * - Consistencia: Mismo sufijo para todas las claves
 * - Mantenimiento: Fácil modificación del sufijo
 * - Type Safety: Tipado fuerte para las claves
 * - Debugging: Fácil identificación de claves de la aplicación
 */

/**
 * Sufijo único para identificar las claves de SirisCloud
 * Cambiar este valor afectará todas las claves de almacenamiento
 */
export const STORAGE_PREFIX = 'siriscloud';

/**
 * Claves de localStorage con sufijo único
 */
export const LOCAL_STORAGE_KEYS = {
  // Autenticación
  AUTH_TOKEN: `token-${STORAGE_PREFIX}`,
  USER_DATA: `userData-${STORAGE_PREFIX}`,
  CURRENT_TENANT: `currentTenant-${STORAGE_PREFIX}`,
  
  // Configuración de la aplicación
  APP_SETTINGS: `appSettings-${STORAGE_PREFIX}`,
  THEME_PREFERENCE: `theme-${STORAGE_PREFIX}`,
  LANGUAGE_PREFERENCE: `language-${STORAGE_PREFIX}`,
  
  // Cache de datos
  CACHED_TENANTS: `cachedTenants-${STORAGE_PREFIX}`,
  CACHED_USER_PROFILE: `cachedProfile-${STORAGE_PREFIX}`,
  
  // Configuración de UI
  SIDEBAR_STATE: `sidebarState-${STORAGE_PREFIX}`,
  DASHBOARD_LAYOUT: `dashboardLayout-${STORAGE_PREFIX}`,
} as const;

/**
 * Claves de sessionStorage con sufijo único
 */
export const SESSION_STORAGE_KEYS = {
  // Datos temporales de sesión
  TEMP_FORM_DATA: `tempFormData-${STORAGE_PREFIX}`,
  NAVIGATION_STATE: `navigationState-${STORAGE_PREFIX}`,
  UPLOAD_PROGRESS: `uploadProgress-${STORAGE_PREFIX}`,
} as const;

/**
 * Claves de IndexedDB con sufijo único
 */
export const INDEXED_DB_KEYS = {
  // Base de datos local
  DATABASE_NAME: `SirisCloudDB-${STORAGE_PREFIX}`,
  OBJECT_STORES: {
    CACHE: `cache-${STORAGE_PREFIX}`,
    OFFLINE_DATA: `offlineData-${STORAGE_PREFIX}`,
    SYNC_QUEUE: `syncQueue-${STORAGE_PREFIX}`,
  }
} as const;

/**
 * Claves antiguas que deben ser limpiadas durante la migración
 */
export const LEGACY_STORAGE_KEYS = [
  'token',
  'currentTenant',
  'userData',
  'appSettings',
  'theme',
  'language',
  'cachedTenants',
  'cachedProfile',
  'sidebarState',
  'dashboardLayout'
];

/**
 * Utilidades para el manejo de almacenamiento
 */
export class StorageUtils {
  /**
   * Limpia todas las claves antiguas de localStorage
   */
  static cleanLegacyData(): void {
    LEGACY_STORAGE_KEYS.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`[StorageUtils] Removed legacy localStorage key: ${key}`);
      }
    });
  }

  /**
   * Limpia todas las claves antiguas de sessionStorage
   */
  static cleanLegacySessionData(): void {
    LEGACY_STORAGE_KEYS.forEach(key => {
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
        console.log(`[StorageUtils] Removed legacy sessionStorage key: ${key}`);
      }
    });
  }

  /**
   * Obtiene una clave de localStorage con prefijo
   */
  static getLocalStorageKey(key: keyof typeof LOCAL_STORAGE_KEYS): string {
    return LOCAL_STORAGE_KEYS[key];
  }

  /**
   * Obtiene una clave de sessionStorage con prefijo
   */
  static getSessionStorageKey(key: keyof typeof SESSION_STORAGE_KEYS): string {
    return SESSION_STORAGE_KEYS[key];
  }

  /**
   * Verifica si una clave pertenece a SirisCloud
   */
  static isSirisCloudKey(key: string): boolean {
    return key.includes(STORAGE_PREFIX);
  }

  /**
   * Obtiene todas las claves de SirisCloud en localStorage
   */
  static getSirisCloudKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isSirisCloudKey(key)) {
        keys.push(key);
      }
    }
    return keys;
  }
}

/**
 * Tipo para las claves de localStorage
 */
export type LocalStorageKey = keyof typeof LOCAL_STORAGE_KEYS;

/**
 * Tipo para las claves de sessionStorage
 */
export type SessionStorageKey = keyof typeof SESSION_STORAGE_KEYS;

