import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import {
  HealthcareProvider,
  HealthcareProviderConfig,
  CreateHealthcareProviderRequest,
  UpdateHealthcareProviderRequest,
  CreateHealthcareProviderConfigRequest,
  UpdateHealthcareProviderConfigRequest,
  HealthcareProviderResponse,
  HealthcareProviderConfigResponse,
  ApiResponse
} from '../dashboard/interfaces/healthcare-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class HealthcareProviderService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlerService);

  private getHeaders(): HttpHeaders {
    // El interceptor se encarga de agregar el token automáticamente
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Healthcare Provider Methods

  /**
   * Crear un nuevo Healthcare Provider
   */
  createHealthcareProvider(data: Omit<CreateHealthcareProviderRequest, 'tenantId'>): Observable<HealthcareProviderResponse> {
    return this.http.post<HealthcareProviderResponse>(
      `${environment.baseUrl}/healthcare-providers`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Obtener todos los Healthcare Providers del tenant del usuario autenticado
   */
  getMyHealthcareProviders(): Observable<HealthcareProvider[]> {
    return this.http.get<HealthcareProvider[]>(
      `${environment.baseUrl}/healthcare-providers/my-healthcare-providers`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Obtener un Healthcare Provider por ID
   */
  getHealthcareProviderById(providerId: string): Observable<HealthcareProvider> {
    return this.http.get<HealthcareProvider>(
      `${environment.baseUrl}/pt/${providerId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Actualizar un Healthcare Provider
   */
  updateHealthcareProvider(providerId: string, data: UpdateHealthcareProviderRequest): Observable<HealthcareProviderResponse> {
    return this.http.patch<HealthcareProviderResponse>(
      `${environment.baseUrl}/healthcare-providers/${providerId}`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Eliminar un Healthcare Provider
   */
  deleteHealthcareProvider(providerId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${environment.baseUrl}/healthcare-providers/${providerId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  // Healthcare Provider Config Methods

  /**
   * Crear una nueva configuración de microservicio
   */
  createHealthcareProviderConfig(data: CreateHealthcareProviderConfigRequest): Observable<HealthcareProviderConfigResponse> {
    return this.http.post<HealthcareProviderConfigResponse>(
      `${environment.baseUrl}/healthcare-providers/configs`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Obtener una configuración de microservicio por ID
   */
  getHealthcareProviderConfigById(configId: string): Observable<HealthcareProviderConfig> {
    return this.http.get<HealthcareProviderConfig>(
      `${environment.baseUrl}/healthcare-providers/configs/${configId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Obtener todas las configuraciones de un Healthcare Provider
   */
  getHealthcareProviderConfigsByProvider(providerId: string): Observable<HealthcareProviderConfig[]> {
    return this.http.get<HealthcareProviderConfig[]>(
      `${environment.baseUrl}/healthcare-providers/${providerId}/configs`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Actualizar una configuración de microservicio
   */
  updateHealthcareProviderConfig(configId: string, data: UpdateHealthcareProviderConfigRequest): Observable<HealthcareProviderConfigResponse> {
    console.log('data', data);
    console.log('configId', configId);
    return this.http.patch<HealthcareProviderConfigResponse>(
      `${environment.baseUrl}/healthcare-providers/${configId}`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Eliminar una configuración de microservicio
   */
  deleteHealthcareProviderConfig(configId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${environment.baseUrl}/healthcare-providers/configs/${configId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Obtener el tenant ID actual
   */
  getCurrentTenantId(): string | null {
    const currentTenant = this.authService.currentTenant();
    return currentTenant?.id || null;
  }
}
