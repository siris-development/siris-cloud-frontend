import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BotTransaction, BotTransactionStats } from '../../healthcare-providers/models/bot-transaction.interface';
import { CreateBotTransactionDto, UpdateBotTransactionDto, BotTransactionQueryParams } from '../../healthcare-providers/models/bot-transaction-dto.interface';

export interface BotTransactionResponse {
  data: BotTransaction[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class BotTransactionService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/bot-transactions`;

  /**
   * Get all bot transactions with optional query parameters
   */
  getAll(params?: BotTransactionQueryParams): Observable<BotTransactionResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.healthcareProviderId) {
        httpParams = httpParams.set('healthcareProviderId', params.healthcareProviderId);
      }
      if (params.page) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.limit) {
        httpParams = httpParams.set('limit', params.limit.toString());
      }
      if (params.sortBy) {
        httpParams = httpParams.set('sortBy', params.sortBy);
      }
      if (params.sortOrder) {
        httpParams = httpParams.set('sortOrder', params.sortOrder);
      }
      if (params.dateFrom) {
        httpParams = httpParams.set('dateFrom', params.dateFrom);
      }
      if (params.dateTo) {
        httpParams = httpParams.set('dateTo', params.dateTo);
      }
    }

    return this.http.get<BotTransactionResponse>(this.baseUrl, { params: httpParams });
  }

  /**
   * Get a specific bot transaction by ID
   */
  getById(id: string): Observable<BotTransaction> {
    return this.http.get<BotTransaction>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new bot transaction
   */
  create(dto: CreateBotTransactionDto): Observable<BotTransaction> {
    return this.http.post<BotTransaction>(this.baseUrl, dto);
  }

  /**
   * Update an existing bot transaction
   */
  update(id: string, dto: UpdateBotTransactionDto): Observable<BotTransaction> {
    return this.http.patch<BotTransaction>(`${this.baseUrl}/${id}`, dto);
  }

  /**
   * Delete a bot transaction
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get transactions for a specific healthcare provider
   */
  getByHealthcareProvider(healthcareProviderId: string, params?: Omit<BotTransactionQueryParams, 'healthcareProviderId'>): Observable<BotTransactionResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.limit) {
        httpParams = httpParams.set('limit', params.limit.toString());
      }
      if (params.sortBy) {
        httpParams = httpParams.set('sortBy', params.sortBy);
      }
      if (params.sortOrder) {
        httpParams = httpParams.set('sortOrder', params.sortOrder);
      }
      if (params.dateFrom) {
        httpParams = httpParams.set('dateFrom', params.dateFrom);
      }
      if (params.dateTo) {
        httpParams = httpParams.set('dateTo', params.dateTo);
      }
    }

    return this.http.get<BotTransactionResponse>(`${this.baseUrl}/healthcare-provider/${healthcareProviderId}`, { params: httpParams });
  }

  /**
   * Get transaction statistics for a healthcare provider
   */
  getStats(healthcareProviderId: string, dateFrom?: string, dateTo?: string): Observable<BotTransactionStats> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('healthcareProviderId', healthcareProviderId);
    
    if (dateFrom) {
      httpParams = httpParams.set('dateFrom', dateFrom);
    }
    if (dateTo) {
      httpParams = httpParams.set('dateTo', dateTo);
    }

    return this.http.get<BotTransactionStats>(`${this.baseUrl}/stats`, { params: httpParams });
  }

  /**
   * Export transactions to CSV
   */
  exportToCsv(params?: BotTransactionQueryParams): Observable<Blob> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.healthcareProviderId) {
        httpParams = httpParams.set('healthcareProviderId', params.healthcareProviderId);
      }
      if (params.dateFrom) {
        httpParams = httpParams.set('dateFrom', params.dateFrom);
      }
      if (params.dateTo) {
        httpParams = httpParams.set('dateTo', params.dateTo);
      }
    }

    return this.http.get(`${this.baseUrl}/export/csv`, { 
      params: httpParams,
      responseType: 'blob'
    });
  }

  /**
   * Export transactions to Excel
   */
  exportToExcel(params?: BotTransactionQueryParams): Observable<Blob> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.healthcareProviderId) {
        httpParams = httpParams.set('healthcareProviderId', params.healthcareProviderId);
      }
      if (params.dateFrom) {
        httpParams = httpParams.set('dateFrom', params.dateFrom);
      }
      if (params.dateTo) {
        httpParams = httpParams.set('dateTo', params.dateTo);
      }
    }

    return this.http.get(`${this.baseUrl}/export/excel`, { 
      params: httpParams,
      responseType: 'blob'
    });
  }

  /**
   * Get transaction analytics data
   */
  getAnalytics(healthcareProviderId?: string, dateFrom?: string, dateTo?: string): Observable<any> {
    let httpParams = new HttpParams();
    
    if (healthcareProviderId) {
      httpParams = httpParams.set('healthcareProviderId', healthcareProviderId);
    }
    if (dateFrom) {
      httpParams = httpParams.set('dateFrom', dateFrom);
    }
    if (dateTo) {
      httpParams = httpParams.set('dateTo', dateTo);
    }

    return this.http.get(`${this.baseUrl}/analytics`, { params: httpParams });
  }

  /**
   * Bulk create transactions
   */
  bulkCreate(dtos: CreateBotTransactionDto[]): Observable<BotTransaction[]> {
    return this.http.post<BotTransaction[]>(`${this.baseUrl}/bulk`, { transactions: dtos });
  }

  /**
   * Bulk update transactions
   */
  bulkUpdate(updates: { id: string; dto: UpdateBotTransactionDto }[]): Observable<BotTransaction[]> {
    return this.http.patch<BotTransaction[]>(`${this.baseUrl}/bulk`, { updates });
  }

  /**
   * Bulk delete transactions
   */
  bulkDelete(ids: string[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/bulk`, { 
      body: { ids } 
    });
  }

  // Convenience methods using firstValueFrom for async/await pattern
  async getAllAsync(params?: BotTransactionQueryParams): Promise<BotTransactionResponse> {
    return firstValueFrom(this.getAll(params));
  }

  async getByIdAsync(id: string): Promise<BotTransaction> {
    return firstValueFrom(this.getById(id));
  }

  async createAsync(dto: CreateBotTransactionDto): Promise<BotTransaction> {
    return firstValueFrom(this.create(dto));
  }

  async updateAsync(id: string, dto: UpdateBotTransactionDto): Promise<BotTransaction> {
    return firstValueFrom(this.update(id, dto));
  }

  async deleteAsync(id: string): Promise<void> {
    return firstValueFrom(this.delete(id));
  }

  async getByHealthcareProviderAsync(healthcareProviderId: string, params?: Omit<BotTransactionQueryParams, 'healthcareProviderId'>): Promise<BotTransactionResponse> {
    return firstValueFrom(this.getByHealthcareProvider(healthcareProviderId, params));
  }

  async getStatsAsync(healthcareProviderId: string, dateFrom?: string, dateTo?: string): Promise<BotTransactionStats> {
    return firstValueFrom(this.getStats(healthcareProviderId, dateFrom, dateTo));
  }

  async exportToCsvAsync(params?: BotTransactionQueryParams): Promise<Blob> {
    return firstValueFrom(this.exportToCsv(params));
  }

  async exportToExcelAsync(params?: BotTransactionQueryParams): Promise<Blob> {
    return firstValueFrom(this.exportToExcel(params));
  }

  async getAnalyticsAsync(healthcareProviderId?: string, dateFrom?: string, dateTo?: string): Promise<any> {
    return firstValueFrom(this.getAnalytics(healthcareProviderId, dateFrom, dateTo));
  }

  async bulkCreateAsync(dtos: CreateBotTransactionDto[]): Promise<BotTransaction[]> {
    return firstValueFrom(this.bulkCreate(dtos));
  }

  async bulkUpdateAsync(updates: { id: string; dto: UpdateBotTransactionDto }[]): Promise<BotTransaction[]> {
    return firstValueFrom(this.bulkUpdate(updates));
  }

  async bulkDeleteAsync(ids: string[]): Promise<void> {
    return firstValueFrom(this.bulkDelete(ids));
  }
}
