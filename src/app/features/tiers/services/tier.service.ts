import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Tier, CreateTierDto, UpdateTierDto, TierQueryDto, TierStats } from '../models/tier.interface';
import { ErrorHandlerService } from '@/shared/services/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class TierService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private baseUrl = `${environment.baseUrl}/tiers`;

  private getHeaders(): HttpHeaders {
    // El interceptor se encarga de agregar el token automáticamente
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  /**
   * Obtener todos los tiers
   */
  findAll(query?: TierQueryDto): Observable<Tier[]> {
    const params = new URLSearchParams();
    
    if (query?.isActive !== undefined) {
      params.append('isActive', query.isActive.toString());
    }
    if (query?.search) {
      params.append('search', query.search);
    }

    const url = params.toString() ? `${this.baseUrl}?${params.toString()}` : this.baseUrl;
    
    return this.http.get<Tier[]>(url, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.log('error', error);
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Obtener tiers activos
   */
  findActive(): Observable<Tier[]> {
    return this.http.get<Tier[]>(`${this.baseUrl}/active`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.log('error', error);
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Obtener un tier por ID
   */
  findOne(id: string): Observable<Tier> {
    return this.http.get<Tier>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.log('error', error);
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Crear un nuevo tier
   */
  create(createTierDto: CreateTierDto): Observable<Tier> {
    return this.http.post<Tier>(this.baseUrl, createTierDto, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.log('error', error);
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Actualizar un tier
   */
  update(id: string, updateTierDto: UpdateTierDto): Observable<Tier> {
    return this.http.patch<Tier>(`${this.baseUrl}/${id}`, updateTierDto, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.log('error', error);
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Eliminar un tier
   */
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.log('error', error);
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }

  /**
   * Obtener estadísticas de tiers
   */
  getStats(): Observable<TierStats> {
    return this.http.get<TierStats>(`${this.baseUrl}/stats`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.log('error', error);
        this.errorHandler.showApiError(error);
        throw error;
      })
    );
  }
}
