import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  HealthcareProvider,

  CreateHealthcareProviderRequest,

} from '@/features';
import { ErrorHandlerService } from '@/shared/services/error-handler.service';
import { ConnectionTestResponse, CreateHealthcareProviderConfigRequest, HealthcareProviderConfig, HealthcareProviderConfigFilters, HealthcareProviderConfigPaginatedResponse, QueryRequest, QueryResponse, UpdateHealthcareProviderConfigRequest } from '@/features/healthcare-providers/models/healthcare-provider-config.interface';

@Injectable({
  providedIn: 'root',
})
export class HealthcareProviderConfigService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private baseUrl = `${environment.baseUrl}/healthcare-providers`;

  private getHeaders(): HttpHeaders {
    // El interceptor se encarga de agregar el token automáticamente
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  /**
   * Obtener todos los proveedores de servicios de salud del tenant
   * Usa el endpoint recomendado que extrae automáticamente el tenant del token
   */
  getHealthcareProviders(): Observable<HealthcareProvider[]> {
    return this.http
      .get<HealthcareProvider[]>(`${this.baseUrl}/my-healthcare-providers`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.log('error', error);
          this.errorHandler.showApiError(error);
          throw error;
        })
      );
  }

  /**
   * Crear un nuevo proveedor de servicios de salud
   */
  createHealthcareProvider(
    provider: CreateHealthcareProviderRequest
  ): Observable<HealthcareProvider> {
    return this.http.post<HealthcareProvider>(this.baseUrl, provider, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obtener un proveedor específico por ID
   */
  getHealthcareProviderById(providerId: string): Observable<HealthcareProvider> {
    return this.http.get<HealthcareProvider>(`${this.baseUrl}/${providerId}/configs`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Eliminar un proveedor de servicios de salud
   */
  deleteHealthcareProvider(providerId: string): Observable<{ message: string; deletedId: string }> {
    return this.http.delete<{ message: string; deletedId: string }>(`${this.baseUrl}/${providerId}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obtener configuraciones de un proveedor específico
   * Usa el endpoint que requiere healthcare_provider_id en la URL
   */
  getHealthcareProviderConfigs(providerId: string): Observable<HealthcareProviderConfig[]> {
    return this.http.get<HealthcareProviderConfig[]>(`${this.baseUrl}/${providerId}/configs`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Crear una nueva configuración para un proveedor
   */
  createHealthcareProviderConfig(
    providerId: string,
    config: CreateHealthcareProviderConfigRequest
  ): Observable<HealthcareProviderConfig> {
    return this.http.post<HealthcareProviderConfig>(
      `${this.baseUrl}/${providerId}/configs`,
      config,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Obtener una configuración específica por ID
   */
  getHealthcareProviderConfigById(configId: string): Observable<HealthcareProviderConfig> {
    return this.http.get<HealthcareProviderConfig>(`${this.baseUrl}/configs/${configId}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Actualizar una configuración específica
   * Usa el endpoint que requiere healthcare_provider_id en la URL
   */
  updateHealthcareProviderConfig(
    providerId: string,
    configId: string,
    config: UpdateHealthcareProviderConfigRequest
  ): Observable<HealthcareProviderConfig> {
    return this.http.put<HealthcareProviderConfig>(
      `${this.baseUrl}/${providerId}/configs`,
      config,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Eliminar una configuración específica
   * Usa el endpoint que requiere healthcare_provider_id en la URL
   */
  deleteHealthcareProviderConfig(
    providerId: string,
    configId: string
  ): Observable<{ message: string; deletedId: string }> {
    return this.http.delete<{ message: string; deletedId: string }>(
      `${this.baseUrl}/${providerId}/configs`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Probar conexión a una configuración específica
   */
  testConnection(
    providerId: string,
    configId: string
  ): Observable<ConnectionTestResponse> {
    return this.http.post<ConnectionTestResponse>(
      `${this.baseUrl}/${providerId}/configs/${configId}/test-connection`,
      {},
      { headers: this.getHeaders() }
    );
  }

  /**
   * Ejecutar consulta SQL en una configuración específica
   */
  executeQuery(
    providerId: string,
    configId: string,
    query: QueryRequest
  ): Observable<QueryResponse> {
    return this.http.post<QueryResponse>(
      `${this.baseUrl}/${providerId}/configs/${configId}/query`,
      query,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Obtener configuraciones con filtros y paginación
   */
  getConfigsWithFilters(
    filters: HealthcareProviderConfigFilters,
    page: number = 1,
    limit: number = 10
  ): Observable<HealthcareProviderConfigPaginatedResponse> {
    const params = new URLSearchParams();

    if (filters.identifier) params.append('identifier', filters.identifier);
    if (filters.name) params.append('name', filters.name);
    if (filters.isActive !== undefined)
      params.append('isActive', filters.isActive.toString());
    if (filters.tenantId) params.append('tenantId', filters.tenantId);

    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return this.http.get<HealthcareProviderConfigPaginatedResponse>(
      `${this.baseUrl}/configs/search?${params.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Activar/Desactivar configuración
   */
  toggleConfigStatus(
    providerId: string,
    configId: string,
    isActive: boolean
  ): Observable<HealthcareProviderConfig> {
    return this.http.patch<HealthcareProviderConfig>(
      `${this.baseUrl}/${providerId}/configs/${configId}/toggle-status`,
      { isActive },
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Obtener estadísticas generales
   */
  getGeneralStats(): Observable<{
    total: number;
    active: number;
    inactive: number;
    connected: number;
    failed: number;
    unknown: number;
  }> {
    return this.http.get<{
      total: number;
      active: number;
      inactive: number;
      connected: number;
      failed: number;
      unknown: number;
    }>(`${this.baseUrl}/configs/stats`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Probar todas las conexiones
   */
  testAllConnections(): Observable<{
    success: boolean;
    results: Array<{
      configId: string;
      providerName: string;
      success: boolean;
      message: string;
    }>;
  }> {
    return this.http.post<{
      success: boolean;
      results: Array<{
        configId: string;
        providerName: string;
        success: boolean;
        message: string;
      }>;
    }>(
      `${this.baseUrl}/configs/test-all`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }
}
