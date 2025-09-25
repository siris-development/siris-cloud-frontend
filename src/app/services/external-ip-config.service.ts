import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ExternalIpConfig,
  CreateExternalIpConfigRequest,
  CreateDatabaseConfigRequest,
  CreateCronHisCitasConfigRequest,
  ConnectionTestResponse,
  QueryRequest,
  QueryResponse,
  CronHisCitasStats,
  ConnectionConfig,
  UpdateConnectionStatusRequest,
  ExternalIpConfigFilters,
  ExternalIpConfigPaginatedResponse,
} from '@/features';
import { ErrorHandlerService } from '@/shared/services/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ExternalIpConfigService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private baseUrl = `${environment.baseUrl}/external-ips-configs`;
  private deployUrl = `${environment.baseUrl}/dokploy-api`;

  private getHeaders(): HttpHeaders {
    // El interceptor se encarga de agregar el token automáticamente
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  /**
   * Obtener todas las configuraciones de IP externa del tenant
   */
  getConfigs(): Observable<ExternalIpConfig[]> {
    return this.http
      .get<ExternalIpConfig[]>(`${this.baseUrl}/cronhis-citas`, {
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
   * Crear una nueva configuración de IP externa
   */
  createConfig(
    config: CreateExternalIpConfigRequest | CreateDatabaseConfigRequest
  ): Observable<ExternalIpConfig> {
    return this.http.post<ExternalIpConfig>(this.baseUrl, config, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Probar conexión a una configuración específica
   */
  testConnection(configId: string): Observable<ConnectionTestResponse> {
    return this.http.post<ConnectionTestResponse>(
      `${this.baseUrl}/${configId}/test-connection`,
      {},
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtener configuración específica de CronHis Citas
   */
  getCronHisCitasConfig(): Observable<ExternalIpConfig> {
    return this.http.get<ExternalIpConfig>(`${this.baseUrl}/cronhis-citas`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Crear configuración específica para CronHis Citas
   */
  createCronHisCitasConfig(
    config: CreateCronHisCitasConfigRequest
  ): Observable<ExternalIpConfig> {
    return this.http.post<ExternalIpConfig>(
      `${this.baseUrl}/cronhis-citas`,
      config,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Ejecutar consulta SQL en CronHis Citas
   */
  executeCronHisCitasQuery(query: QueryRequest): Observable<QueryResponse> {
    return this.http.post<QueryResponse>(
      `${this.baseUrl}/cronhis-citas/query`,
      query,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Obtener estadísticas de CronHis Citas
   */
  getCronHisCitasStats(): Observable<CronHisCitasStats> {
    return this.http.get<CronHisCitasStats>(
      `${this.baseUrl}/cronhis-citas/stats`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Actualizar una configuración existente
   */
  updateConfig(
    configId: string,
    config: Partial<CreateExternalIpConfigRequest>
  ): Observable<ExternalIpConfig> {
    return this.http.put<ExternalIpConfig>(
      `${this.baseUrl}/${configId}`,
      config,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Eliminar una configuración
   */
  deleteConfig(configId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${configId}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obtener una configuración específica por ID
   */
  getConfigById(configId: string): Observable<ExternalIpConfig> {
    return this.http.get<ExternalIpConfig>(`${this.baseUrl}/${configId}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obtener configuraciones con filtros y paginación
   */
  getConfigsWithFilters(
    filters: ExternalIpConfigFilters,
    page: number = 1,
    limit: number = 10
  ): Observable<ExternalIpConfigPaginatedResponse> {
    const params = new URLSearchParams();

    if (filters.systemName) params.append('systemName', filters.systemName);
    if (filters.nit) params.append('nit', filters.nit);
    if (filters.isActive !== undefined)
      params.append('isActive', filters.isActive.toString());
    if (filters.connectionStatus)
      params.append('connectionStatus', filters.connectionStatus);
    if (filters.tenantId) params.append('tenantId', filters.tenantId);

    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return this.http.get<ExternalIpConfigPaginatedResponse>(
      `${this.baseUrl}/search?${params.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Actualizar estado de conexión
   */
  updateConnectionStatus(
    configId: string,
    status: UpdateConnectionStatusRequest
  ): Observable<ExternalIpConfig> {
    return this.http.patch<ExternalIpConfig>(
      `${this.baseUrl}/${configId}/connection-status`,
      status,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Obtener configuración de conexión
   */
  getConnectionConfig(configId: string): Observable<ConnectionConfig> {
    return this.http.get<ConnectionConfig>(
      `${this.baseUrl}/${configId}/connection-config`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Obtener URL de conexión
   */
  getConnectionUrl(configId: string): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(
      `${this.baseUrl}/${configId}/connection-url`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Activar/Desactivar configuración
   */
  toggleConfigStatus(
    configId: string,
    isActive: boolean
  ): Observable<ExternalIpConfig> {
    return this.http.patch<ExternalIpConfig>(
      `${this.baseUrl}/${configId}/toggle-status`,
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
    }>(`${this.baseUrl}/stats`, {
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
      systemName: string;
      success: boolean;
      message: string;
    }>;
  }> {
    return this.http.post<{
      success: boolean;
      results: Array<{
        configId: string;
        systemName: string;
        success: boolean;
        message: string;
      }>;
    }>(
      `${this.baseUrl}/test-all`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Despliega una configuración específica
   */
  deployConfig(id: string): Observable<{
    success: boolean;
    message: string;
    deploymentId?: string;
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
      deploymentId?: string;
    }>(
      `${this.deployUrl}/deploy-cronhis`,
      { id },
      {
        headers: this.getHeaders(),
      }
    );
  }


}
