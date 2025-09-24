# Arquitectura del Proyecto - SirisCloud Frontend

## Nueva Estructura Basada en Features

```
src/app/
├── core/                           # Funcionalidades core compartidas
│   ├── config/
│   ├── guards/
│   ├── interceptors/
│   ├── services/
│   └── utils/
├── shared/                       # Componentes y utilidades compartidas
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   └── models/
├── features/                     # Features organizadas por dominio
│   ├── auth/                     # 🔐 Autenticación
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── auth.routes.ts
│   ├── healthcare-providers/     # 🏥 Proveedores de Salud
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── models/
│   │   └── healthcare-providers.routes.ts
│   ├── external-ips/            # 🌐 IPs Externas
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── models/
│   │   └── external-ips.routes.ts
│   ├── payment/                 # 💳 Pagos
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── models/
│   │   └── payment.routes.ts
│   ├── whatsapp/                # 📱 WhatsApp
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── models/
│   │   └── whatsapp.routes.ts
│   ├── dashboard/               # 📊 Dashboard
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── models/
│   │   └── dashboard.routes.ts
│   └── landing/                 # 🏠 Landing Page
│       ├── components/
│       ├── pages/
│       └── landing.routes.ts
└── app.routes.ts               # Rutas principales
```

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

## Flujo de Rutas

```
/ (Landing)
├── /auth (Auth Feature)
│   ├── /login
│   ├── /register
│   ├── /forgot-password
│   ├── /confirm-email
│   └── /resend-confirmation
└── /dashboard (Dashboard Feature)
    ├── / (Home)
    ├── /payment (Payment Feature)
    ├── /whatsapp (WhatsApp Feature)
    ├── /healthcare-providers (Healthcare Providers Feature)
    └── /external-ips (External IPs Feature)
```

## Beneficios de la Nueva Estructura

1. **Mantenibilidad**: Código organizado por dominio
2. **Escalabilidad**: Fácil agregar nuevas features
3. **Testing**: Testing aislado por feature
4. **Colaboración**: Equipos pueden trabajar en features independientes
5. **Reutilización**: Componentes y servicios compartidos
6. **Performance**: Lazy loading por feature
7. **Claridad**: Estructura intuitiva y fácil de navegar

## Migración Completada

✅ Todas las features han sido movidas a su nueva ubicación
✅ Rutas actualizadas para usar la nueva estructura
✅ Imports corregidos
✅ Archivos de barril creados
✅ Documentación generada
✅ Sin errores de linting
