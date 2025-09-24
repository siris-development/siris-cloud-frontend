export interface ExternalIpConfig {
  id: string;
  tenantId: string;
  systemName: string;
  nit: string;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password?: string; // Solo para creación/actualización
  connectionString: string;
  isActive: boolean;
  isSslEnabled: boolean;
  connectionTimeout: number;
  queryTimeout: number;
  maxConnections: number;
  lastConnectionTest?: Date | string;
  connectionStatus: 'unknown' | 'connected' | 'failed' | 'testing';
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
  tenant?: {
    id: string;
    name: string;
  };
}

// Interface específica para configuraciones de base de datos
export interface DatabaseConfig {
  id: string;
  tenantId: string;
  systemName: string;
  nit: string;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password?: string;
  connectionString: string;
  isActive: boolean;
  isSslEnabled: boolean;
  connectionTimeout: number;
  queryTimeout: number;
  maxConnections: number;
  lastConnectionTest?: Date | string;
  connectionStatus: 'unknown' | 'connected' | 'failed' | 'testing';
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
  tenant?: {
    id: string;
    name: string;
  };
}

export interface CreateExternalIpConfigRequest {
  tenantId: string;
  systemName: string;
  nit: string;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
  connectionString: string;
  isActive: boolean;
  isSslEnabled: boolean;
  connectionTimeout: number;
  queryTimeout: number;
  maxConnections: number;
}

// Interface específica para crear configuraciones de base de datos
export interface CreateDatabaseConfigRequest {
  tenantId: string;
  systemName: string;
  nit: string;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
}

export interface CreateCronHisCitasConfigRequest {
  tenantId: string;
  nit: string;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
}

export interface ConnectionTestResponse {
  success: boolean;
  message: string;
  details: {
    host: string;
    port: number;
    database: string;
    responseTime: number;
    testQuery: string;
    result: any;
  };
}

export interface QueryRequest {
  query: string;
  params: any[];
}

export interface QueryResponse {
  success: boolean;
  data: any[];
  error?: string;
}

export interface CronHisCitasStats {
  config: ExternalIpConfig;
  poolStats: {
    totalConnections: number;
    activeConnections: number;
    idleConnections: number;
    waitingClients: number;
  };
  lastActivity: string;
  uptime: number;
}

// Interfaces para métodos de utilidad
export interface ConnectionConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
  connectionTimeout: number;
  queryTimeout: number;
  maxConnections: number;
}

export interface UpdateConnectionStatusRequest {
  status: 'unknown' | 'connected' | 'failed' | 'testing';
  errorMessage?: string;
}

// Interface para filtros de búsqueda
export interface ExternalIpConfigFilters {
  systemName?: string;
  nit?: string;
  isActive?: boolean;
  connectionStatus?: 'unknown' | 'connected' | 'failed' | 'testing';
  tenantId?: string;
}

// Interface para paginación
export interface ExternalIpConfigPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Interface para respuesta paginada
export interface ExternalIpConfigPaginatedResponse {
  data: ExternalIpConfig[];
  pagination: ExternalIpConfigPagination;
}
