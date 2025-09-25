# Features Architecture

Esta carpeta contiene todas las features del proyecto organizadas de manera modular siguiendo principios DRY (Don't Repeat Yourself).

## Estructura

Cada feature tiene su propia carpeta con la siguiente estructura:

```
feature-name/
├── components/          # Componentes específicos de la feature
├── pages/              # Páginas de la feature
├── services/           # Servicios específicos de la feature
├── models/             # Interfaces y tipos específicos
├── guards/             # Guards específicos (si aplica)
├── interceptors/       # Interceptors específicos (si aplica)
├── feature.routes.ts   # Rutas de la feature
└── index.ts           # Archivo de barril para exports
```

## Features Disponibles

### 🔐 Auth Feature
- **Ubicación**: `./auth/`
- **Responsabilidad**: Autenticación, registro, login, recuperación de contraseña
- **Rutas**: `/auth/*`

### 🏥 Healthcare Providers Feature
- **Ubicación**: `./healthcare-providers/`
- **Responsabilidad**: Gestión de proveedores de servicios de salud (PTS)
- **Rutas**: `/dashboard/healthcare-providers`

### 🌐 External IPs Feature
- **Ubicación**: `./external-ips/`
- **Responsabilidad**: Configuración de IPs externas
- **Rutas**: `/dashboard/external-ips`

### 💳 Payment Feature
- **Ubicación**: `./payment/`
- **Responsabilidad**: Gestión de pagos y facturación
- **Rutas**: `/dashboard/payment`

### 📱 WhatsApp Feature
- **Ubicación**: `./whatsapp/`
- **Responsabilidad**: Integración con WhatsApp Business
- **Rutas**: `/dashboard/whatsapp`

### 📊 Dashboard Feature
- **Ubicación**: `./dashboard/`
- **Responsabilidad**: Panel principal y layout del dashboard
- **Rutas**: `/dashboard/*`

### 🏠 Landing Feature
- **Ubicación**: `./landing/`
- **Responsabilidad**: Página de inicio pública
- **Rutas**: `/`

## Principios Aplicados

### 🎯 Single Responsibility Principle (SRP)
Cada feature tiene una responsabilidad específica y bien definida.

### 🔄 Don't Repeat Yourself (DRY)
- Servicios compartidos en `core/`
- Componentes reutilizables en `shared/`
- Archivos de barril para imports limpios

### 🏗️ Modular Architecture
- Cada feature es independiente
- Fácil mantenimiento y testing
- Escalabilidad mejorada

## Uso

### Importar desde una feature:
```typescript
import { AuthService } from './features/auth';
import { HealthcareProviderService } from './features/healthcare-providers';
```

### Importar desde el barril principal:
```typescript
import { AuthService, HealthcareProviderService } from './features';
```

## Beneficios

1. **Mantenibilidad**: Código organizado por dominio
2. **Escalabilidad**: Fácil agregar nuevas features
3. **Testing**: Testing aislado por feature
4. **Colaboración**: Equipos pueden trabajar en features independientes
5. **Reutilización**: Componentes y servicios compartidos
