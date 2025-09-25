# Utilidades Compartidas (Shared Utils)

Este directorio contiene utilidades reutilizables que pueden ser utilizadas en toda la aplicación.

## Estructura

```
src/app/shared/utils/
├── storage.utils.ts    # Utilidades para manejo de localStorage/sessionStorage
├── index.ts           # Exportaciones centralizadas
└── README.md          # Documentación
```

## StorageUtils

Clase estática que proporciona métodos seguros para el manejo del almacenamiento local.

### Métodos Disponibles

#### `getTenantIdFromStorage(): string`
Obtiene el tenantId del localStorage buscando en múltiples ubicaciones:
- `localStorage.getItem('tenantId')`
- `localStorage.getItem('userSession').tenantId`
- `localStorage.getItem('currentTenant').id`
- `localStorage.getItem('authData').tenantId`

#### `getUserIdFromStorage(): string`
Obtiene el userId del localStorage buscando en múltiples ubicaciones.

#### `getAuthTokenFromStorage(): string`
Obtiene el token de autenticación del localStorage.

#### `setItem(key: string, value: any): void`
Guarda un valor en localStorage de forma segura.

#### `getItem<T>(key: string, defaultValue?: T): T | null`
Obtiene un valor del localStorage de forma segura con tipado.

#### `removeItem(key: string): void`
Elimina un valor del localStorage de forma segura.

#### `clear(): void`
Limpia todo el localStorage de forma segura.

#### `isAvailable(): boolean`
Verifica si localStorage está disponible.

## Uso

```typescript
import { StorageUtils } from '../../../shared/utils';

// Obtener tenantId
const tenantId = StorageUtils.getTenantIdFromStorage();

// Obtener userId
const userId = StorageUtils.getUserIdFromStorage();

// Obtener token
const token = StorageUtils.getAuthTokenFromStorage();

// Guardar datos
StorageUtils.setItem('miClave', { datos: 'valor' });

// Obtener datos con tipado
const datos = StorageUtils.getItem<{datos: string}>('miClave');
```

## Características

- ✅ **Manejo de errores**: Todos los métodos incluyen try-catch
- ✅ **Múltiples fuentes**: Busca en diferentes ubicaciones del localStorage
- ✅ **Tipado**: Soporte para TypeScript con generics
- ✅ **Logging**: Advertencias y errores en consola
- ✅ **Fallbacks**: Valores por defecto seguros
- ✅ **Compatibilidad**: Verificación de disponibilidad de localStorage

## Extensión

Para agregar nuevas utilidades:

1. Crear un nuevo archivo `nueva-utilidad.utils.ts`
2. Exportar la clase/funciones desde `index.ts`
3. Documentar en este README
4. Agregar tests si es necesario
