export interface HealthcareProvider {
  id: string;
  tenantId: string;
  identifier: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface HealthcareProviderConfig {
  id: string;
  healthcareProviderId: string;
  healthcareProvider?: HealthcareProvider;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUsername: string;
  dbPassword?: string; // Solo para creación/actualización
  isActive: boolean;
  msPort?: number;
  urlBotIa?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateHealthcareProviderRequest {
  identifier: string;
  name: string;
}

export interface CreateHealthcareProviderConfigRequest {
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUsername: string;
  dbPassword: string;
  isActive: boolean;
  msPort?: number;
  urlBotIa?: string;
}

export interface UpdateHealthcareProviderConfigRequest {
  dbHost?: string;
  dbPort?: number;
  dbName?: string;
  dbUsername?: string;
  dbPassword?: string;
  isActive?: boolean;
  msPort?: number;
  urlBotIa?: string;
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

export interface HealthcareProviderConfigFilters {
  identifier?: string;
  name?: string;
  isActive?: boolean;
  tenantId?: string;
}

export interface HealthcareProviderConfigPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HealthcareProviderConfigPaginatedResponse {
  data: HealthcareProviderConfig[];
  pagination: HealthcareProviderConfigPagination;
}
