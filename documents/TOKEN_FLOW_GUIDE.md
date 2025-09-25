# Guía de Flujo de Tokens con Tenant ID

## Flujo Completo

### 1. Login/Register (Backend → Frontend)

**Respuesta del backend**:
```json
{
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com"
  },
  "session": {
    "access_token": "supabase-token",
    "refresh_token": "refresh-token"
  },
  "customToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // ← ESTE ES EL TOKEN A USAR
  "tenants": [...],
  "primaryTenant": {
    "id": "uuid-del-tenant",
    "name": "Mi Empresa",
    "role": "admin"
  }
}
```

### 2. Frontend - Guardar Token

```javascript
// Después del login
const authData = await login(credentials);

// Guardar el customToken (NO el access_token de Supabase)
localStorage.setItem('authToken', authData.customToken);
localStorage.setItem('tenantId', authData.primaryTenant.id);
```

### 3. Frontend - Enviar Peticiones

```javascript
// Obtener el token guardado
const token = localStorage.getItem('authToken');

// Enviar peticiones con el token
const response = await fetch('/api/healthcare-providers/my-healthcare-providers', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`, // ← Token personalizado con tenant_id
    'Content-Type': 'application/json'
  }
});
```

### 4. Backend - Procesamiento del Token

#### HybridAuthGuard extrae automáticamente:
- `request.user.id` - ID del usuario
- `request.user.email` - Email del usuario  
- `request.tenantId` - ID del tenant
- `request.tenantContext.tenantId` - ID del tenant
- `request.tenantContext.role` - Rol del usuario

#### El controlador recibe:
```typescript
async getMyHealthcareProviders(
  @CurrentTenant() tenantContext: any, // ← tenantContext.tenantId viene del token
) {
  // tenantContext.tenantId ya contiene el tenant_id del token
  return await this.healthcareProviderService.getHealthcareProvidersByTenant(tenantContext.tenantId);
}
```

## Estructura del Token Personalizado

El `customToken` contiene:
```json
{
  "sub": "uuid-del-usuario",
  "email": "usuario@ejemplo.com", 
  "tenantId": "uuid-del-tenant", // ← ESTE ES EL TENANT_ID
  "role": "admin",
  "iat": 1642123456,
  "exp": 1642209856,
  "iss": "siris-cloud-backend",
  "aud": "siris-cloud-api"
}
```

## Endpoints Disponibles

### 1. Obtener Proveedores de Servicios de Salud del Tenant del Usuario
```
GET /api/healthcare-providers/my-healthcare-providers
Authorization: Bearer <customToken>
```
- No requiere `tenantId` en la URL
- Usa automáticamente el `tenantId` del token

### 2. Obtener Proveedores de Servicios de Salud de un Tenant Específico
```
GET /api/healthcare-providers/tenant/:tenantId
Authorization: Bearer <customToken>
```
- Requiere que el `tenantId` en la URL coincida con el del token

### 3. Crear Healthcare Provider
```
POST /api/healthcare-providers
Authorization: Bearer <customToken>
Content-Type: application/json

{
  "tenantId": "uuid-del-tenant", // Debe coincidir con el del token
  "identifier": "hospital-001",
  "name": "Hospital General"
}
```

## Ejemplo de Uso Completo

### Frontend (JavaScript)
```javascript
class HealthcareProviderAPI {
  constructor() {
    this.baseURL = '/api/healthcare-providers';
    this.token = localStorage.getItem('authToken');
  }

  async getMyHealthcareProviders() {
    const response = await fetch(`${this.baseURL}/my-healthcare-providers`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  async createHealthcareProvider(data) {
    // El tenantId se obtiene del token, no se envía en el body
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tenantId: this.getTenantIdFromToken(), // Obtener del token
        ...data
      })
    });
    return response.json();
  }

  getTenantIdFromToken() {
    // Decodificar el token para obtener el tenantId
    const payload = JSON.parse(atob(this.token.split('.')[1]));
    return payload.tenantId;
  }
}
```

### Backend (NestJS)
```typescript
@Controller('healthcare-providers')
export class HealthcareProviderController {
  
  @Get('my-healthcare-providers')
  @UseGuards(HybridAuthGuard)
  @TenantRole('admin')
  async getMyHealthcareProviders(
    @CurrentTenant() tenantContext: any, // ← tenantContext.tenantId viene del token
  ) {
    // El tenantId ya está disponible desde el token
    return await this.healthcareProviderService.getHealthcareProvidersByTenant(tenantContext.tenantId);
  }

  @Post()
  @UseGuards(HybridAuthGuard)
  @TenantRole('admin')
  async createHealthcareProvider(
    @Body() createDto: CreateHealthcareProviderDto,
    @CurrentTenant() tenantContext: any, // ← tenantContext.tenantId viene del token
  ) {
    // Verificar que el tenantId del DTO coincida con el del token
    if (createDto.tenantId !== tenantContext.tenantId) {
      throw new Error('Tenant ID mismatch');
    }
    return await this.healthcareProviderService.createHealthcareProvider(createDto);
  }
}
```

## Ventajas de este Flujo

1. **Seguridad**: El `tenantId` viene del token, no puede ser manipulado por el frontend
2. **Simplicidad**: El frontend solo necesita enviar el token
3. **Performance**: No se requieren consultas adicionales para obtener el tenant
4. **Consistencia**: Todos los endpoints usan el mismo mecanismo de autenticación
5. **Flexibilidad**: Soporta tanto tokens personalizados como tokens de Supabase

## Troubleshooting

### Error: "Formato de token inválido"
- Verificar que el token tenga 3 partes separadas por puntos
- Verificar que el header sea `Authorization: Bearer <token>`

### Error: "Tenant ID mismatch"
- Verificar que el `tenantId` en el body coincida con el del token
- Usar el endpoint `/my-healthcare-providers` para evitar especificar tenantId

### Error: "Token inválido o expirado"
- Verificar que el token no haya expirado (24 horas)
- Hacer login nuevamente para obtener un nuevo token
