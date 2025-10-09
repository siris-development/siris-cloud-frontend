import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  UsageQueryParams,
  BudgetUpdateRequest,
  BudgetUpdateResponse,
  BudgetResponse,
  BudgetThresholdUpdateRequest,
  BudgetThresholdUpdateResponse,
} from '../models/usage.interface';

@Injectable({
  providedIn: 'root'
})
export class UsageService {
  private http = inject(HttpClient);
  private readonly botTransactionsUrl = `${environment.baseUrl}/bot-transactions`;

  getCompletionsUsage(params: UsageQueryParams): Observable<any> {
    const queryParams: string[] = [];
    
    if (params.healthcareProviderId) {
      queryParams.push(`healthcareProviderId=${encodeURIComponent(params.healthcareProviderId)}`);
    }
    if (params.startDate) {
      queryParams.push(`startDate=${encodeURIComponent(params.startDate)}`);
    }
    if (params.endDate) {
      queryParams.push(`endDate=${encodeURIComponent(params.endDate)}`);
    }
    if (params.groupBy) {
      queryParams.push(`groupBy=${encodeURIComponent(params.groupBy)}`);
    }
    if (params.projectId) {
      queryParams.push(`projectIds=${encodeURIComponent(params.projectId)}`);
    }
    if (params.apiKeyId) {
      queryParams.push(`apiKeyIds=${encodeURIComponent(params.apiKeyId)}`);
    }

    return this.http.get<any>(`${this.botTransactionsUrl}/analytics/chat-completions-usage?${queryParams.join('&')}`);
  }

  getBudgetResponse(healthcareProviderId: string): Observable<BudgetResponse> {
    return this.http.get<BudgetResponse>(`${this.botTransactionsUrl}/analytics/budget/${healthcareProviderId}`);
  }

  updateBudget(request: BudgetUpdateRequest): Observable<BudgetUpdateResponse> {
    return this.http.put<BudgetUpdateResponse>(`${this.botTransactionsUrl}/analytics/budget/${request.healthcareProviderId}`, {
      budget: request.budget
    });
  }

  updateBudgetAlert(request: BudgetThresholdUpdateRequest): Observable<BudgetThresholdUpdateResponse> {
    return this.http.put<BudgetThresholdUpdateResponse>(`${this.botTransactionsUrl}/analytics/budget-threshold/${request.healthcareProviderId}`, {
      threshold: request.threshold,
      emailSubject: request.emailSubject,
    });
  }
}
