/**
 * Utilidades para manejo de localStorage y sessionStorage
 */

export class StorageUtils {
  /**
   * Obtiene el tenantId del localStorage
   * Busca primero en 'currentTenant-siriscloud' y luego en otras ubicaciones para mayor compatibilidad
   * @returns {string} El tenantId encontrado o string vacío si no se encuentra
   */
  static getTenantIdFromStorage(): string {
    try {
      // 1. Intentar obtener de 'currentTenant-siriscloud' (clave principal)
      const currentTenantSiriscloud = localStorage.getItem('currentTenant-siriscloud');
      if (currentTenantSiriscloud) {
        const tenant = JSON.parse(currentTenantSiriscloud);
        if (tenant.id) {
          return tenant.id;
        }
      }

      // 2. Intentar obtener directamente 'tenantId'
      const tenantId = localStorage.getItem('tenantId');
      if (tenantId) {
        return tenantId;
      }

      // 3. Intentar obtener de 'userSession'
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        const session = JSON.parse(userSession);
        if (session.tenantId) {
          return session.tenantId;
        }
      }

      // 4. Intentar obtener de 'currentTenant'
      const currentTenant = localStorage.getItem('currentTenant');
      if (currentTenant) {
        const tenant = JSON.parse(currentTenant);
        if (tenant.id) {
          return tenant.id;
        }
      }

      // 4. Intentar obtener de 'authData'
      const authData = localStorage.getItem('authData');
      if (authData) {
        const auth = JSON.parse(authData);
        if (auth.tenantId) {
          return auth.tenantId;
        }
        if (auth.tenant?.id) {
          return auth.tenant.id;
        }
      }

      // 5. Si no se encuentra ningún tenantId, devolver string vacío
      console.warn('No se pudo obtener tenantId del localStorage');
      return '';
    } catch (error) {
      console.error('Error al obtener tenantId del localStorage:', error);
      return '';
    }
  }

  /**
   * Obtiene el userId del localStorage
   * @returns {string} El userId encontrado o string vacío si no se encuentra
   */
  static getUserIdFromStorage(): string {
    try {
      // 1. Intentar obtener directamente 'userId'
      const userId = localStorage.getItem('userId');
      if (userId) {
        return userId;
      }

      // 2. Intentar obtener de 'userSession'
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        const session = JSON.parse(userSession);
        if (session.userId) {
          return session.userId;
        }
        if (session.user?.id) {
          return session.user.id;
        }
      }

      // 3. Intentar obtener de 'authData'
      const authData = localStorage.getItem('authData');
      if (authData) {
        const auth = JSON.parse(authData);
        if (auth.userId) {
          return auth.userId;
        }
        if (auth.user?.id) {
          return auth.user.id;
        }
      }

      console.warn('No se pudo obtener userId del localStorage');
      return '';
    } catch (error) {
      console.error('Error al obtener userId del localStorage:', error);
      return '';
    }
  }

  /**
   * Obtiene el token de autenticación del localStorage
   * @returns {string} El token encontrado o string vacío si no se encuentra
   */
  static getAuthTokenFromStorage(): string {
    try {
      // 1. Intentar obtener directamente 'token'
      const token = localStorage.getItem('token');
      if (token) {
        return token;
      }

      // 2. Intentar obtener de 'authToken'
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        return authToken;
      }

      // 3. Intentar obtener de 'userSession'
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        const session = JSON.parse(userSession);
        if (session.token) {
          return session.token;
        }
        if (session.accessToken) {
          return session.accessToken;
        }
      }

      // 4. Intentar obtener de 'authData'
      const authData = localStorage.getItem('authData');
      if (authData) {
        const auth = JSON.parse(authData);
        if (auth.token) {
          return auth.token;
        }
        if (auth.accessToken) {
          return auth.accessToken;
        }
      }

      console.warn('No se pudo obtener token del localStorage');
      return '';
    } catch (error) {
      console.error('Error al obtener token del localStorage:', error);
      return '';
    }
  }

  /**
   * Guarda un valor en localStorage de forma segura
   * @param key - La clave del valor
   * @param value - El valor a guardar
   */
  static setItem(key: string, value: any): void {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error);
    }
  }

  /**
   * Obtiene un valor del localStorage de forma segura
   * @param key - La clave del valor
   * @param defaultValue - Valor por defecto si no se encuentra
   * @returns El valor encontrado o el valor por defecto
   */
  static getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      
      // Intentar parsear como JSON, si falla devolver como string
      try {
        return JSON.parse(item);
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error(`Error al obtener ${key} del localStorage:`, error);
      return defaultValue;
    }
  }

  /**
   * Elimina un valor del localStorage de forma segura
   * @param key - La clave del valor a eliminar
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error al eliminar ${key} del localStorage:`, error);
    }
  }

  /**
   * Limpia todo el localStorage de forma segura
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  }

  /**
   * Verifica si localStorage está disponible
   * @returns true si localStorage está disponible, false en caso contrario
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
