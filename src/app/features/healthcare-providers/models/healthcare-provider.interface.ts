/**
 * Interfaces para Proveedores de Servicios de Salud
 */

export interface HealthcareProvider {
  id: string;
  tenantId: string;
  identifier: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateHealthcareProviderRequest {
  identifier: string;
  name: string;
}

export interface UpdateHealthcareProviderRequest {
  identifier?: string;
  name?: string;
}

export interface HealthcareProviderResponse {
  id: string;
  tenantId: string;
  identifier: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
