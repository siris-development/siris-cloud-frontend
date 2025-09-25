export interface Tenant {
  // Identificación
  id: string;
  name: string;
  identifier: string;
  
  // Estado
  isActive: boolean;
  isVerified: boolean;
  
  // Configuración
  billingCurrency?: string;        // USD, EUR, COP, etc.
  timeZone?: string;              // America/Bogota, Europe/Madrid, etc.
  
  // Límites de uso
  maxWhatsappAccounts?: number;   // Máximo de cuentas WhatsApp
  maxMonthlyMessages?: number;    // Máximo de mensajes por mes
  maxDailyMessages?: number;      // Máximo de mensajes por día
  
  // Datos adicionales
  settings?: {                    // Configuraciones personalizadas
    theme?: string;
    language?: string;
    notifications?: boolean;
    [key: string]: any;
  };
  metadata?: {                    // Metadatos del tenant
    industry?: string;
    size?: string;
    [key: string]: any;
  };
  
  // Rol del usuario en este tenant
  role: 'admin' | 'user';
  
  // Fechas
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz específica para el tenant principal
export interface PrimaryTenant extends Tenant {
  // El tenant principal siempre tiene todos los campos requeridos
  isVerified: boolean;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}