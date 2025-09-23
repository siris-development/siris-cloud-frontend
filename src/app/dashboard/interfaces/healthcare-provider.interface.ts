/**
 * Interfaces para Healthcare Providers (Proveedores de Servicios de Salud)
 */

export interface HealthcareProvider {
  id: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  identifier?: string;
  name?: string;
  ptMs?: HealthcareProviderConfig[];
}

export interface HealthcareProviderConfig {
  id: string;
  createdAt: string;
  updatedAt: string;
  idPts: string;
  dbHost?: string;
  dbPort?: number;
  dbName?: string;
  dbUsername?: string;
  dbPassword?: string;
  isActive: boolean;
  msPort?: number;
  urlBotIa?: string;
}

export interface CreateHealthcareProviderRequest {
  tenantId: string;
  identifier?: string;
  name?: string;
}

export interface UpdateHealthcareProviderRequest {
  identifier?: string;
  name?: string;
}

export interface CreateHealthcareProviderConfigRequest {
  idPts: string;
  dbHost?: string;
  dbPort?: number;
  dbName?: string;
  dbUsername?: string;
  dbPassword?: string;
  isActive?: boolean;
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

export interface HealthcareProviderResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  identifier?: string;
  name?: string;
}

export interface HealthcareProviderConfigResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  idPts: string;
  dbHost?: string;
  dbPort?: number;
  dbName?: string;
  dbUsername?: string;
  dbPassword?: string;
  isActive: boolean;
  msPort?: number;
  urlBotIa?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
