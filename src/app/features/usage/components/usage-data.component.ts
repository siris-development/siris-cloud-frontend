import { Component, Input, Output, EventEmitter, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { UsageService } from '../services/usage.service';
import { environment } from '../../../../environments/environment';
import { 
  BudgetConfig,
  BudgetResponse,
  BudgetThresholdUpdateRequest,
  BudgetThresholdUpdateResponse,
  BudgetUpdateRequest,
  BudgetUpdateResponse,
  OpenAIUsage,
  OpenAIUsagePage,
  OpenAIUsageBucket,
} from '../models/usage.interface';

@Component({
  selector: 'app-usage-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usage-data.component.html',
  styleUrls: ['./usage-data.component.css']
})
export class UsageDataComponent implements OnInit {
  @Input() projectId: string = '';
  @Input() projectName: string = '';
  @Output() dataLoaded = new EventEmitter<boolean>();

  private errorHandler = inject(ErrorHandlerService);
  private usageService = inject(UsageService);

  // Signals para el estado del componente
  budgetConfig = signal<BudgetConfig | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // Estados para filtros y configuración
  startDate = signal<string>(new Date('2025-10-05').toISOString().split('T')[0]);
  endDate = signal<string>(new Date('2025-10-10').toISOString().split('T')[0]);
  groupBy = signal<'day' | 'week' | 'month'>('day');
  selectedProjectId = signal<string>('');
  showDatePickerModal = signal<boolean>(false);
  showBudgetEditModal  = signal<boolean>(false);
  showBudgetAlertModal = signal<boolean>(false);
  showTooltip = signal<boolean>(false);
  tooltipData = signal<{date: Date, inputTokens: number, requests: number, x: number, y: number} | null>(null);
  
  // Analytics data signals
  budget = signal<BudgetResponse | null>(null);
  usagePage = signal<OpenAIUsagePage | null>(null);
  usageBuckets = signal<OpenAIUsageBucket[]>([]);
  currentOpenAIUsage = signal<OpenAIUsage | null>(null);
  
  // Computed signals for stable values
  bucketDataPoints = computed(() => {
    const buckets = this.usageBuckets();
    console.log('Computing bucketDataPoints, buckets:', buckets);
    
    const filteredBuckets = buckets.filter(bucket => bucket.results.length > 0);
    console.log('Filtered buckets with data:', filteredBuckets);
    
    const dataPoints = filteredBuckets.map(bucket => {
      const totalInputTokens = bucket.results.reduce((sum, result) => sum + (result.input_tokens || 0), 0);
      const totalRequests = bucket.results.reduce((sum, result) => sum + (result.num_model_requests || 0), 0);
      
      const dataPoint = {
        date: new Date(bucket.start_time * 1000),
        inputTokens: totalInputTokens,
        requests: totalRequests
      };
      
      console.log('Data point:', dataPoint);
      return dataPoint;
    });
    
    console.log('Final dataPoints:', dataPoints);
    return dataPoints;
  });
  
  maxInputTokens = computed(() => {
    const dataPoints = this.bucketDataPoints();
    if (dataPoints.length === 0) return 1;
    const tokens = dataPoints.map(p => p.inputTokens).filter(t => t > 0);
    return tokens.length > 0 ? Math.max(...tokens) : 1;
  });
  
  // Budget form signals
  budgetForm = signal({
    budget: 0
  });
  
  budgetAlertForm = signal({
    threshold: 0,
    emailSubject: '',
  });  


  ngOnInit() {
    this.loading.set(false);
    this.error.set(null);
    this.loadBudget();
    this.loadChatCompletionsData();
  }

  private getHealthcareProviderId() {
    const selectedProviderData = localStorage.getItem('selectedHealthcareProvider');
    
    if (selectedProviderData) {
      try {
        const provider = JSON.parse(selectedProviderData);
        return provider.id;
      } catch (parseError) {
      }
    } else {
      return '';
    }
  }

  clearSuccess() {
    this.success.set(null);
  }

  clearError() {
    this.error.set(null);
  }

  async loadChatCompletionsData() {
    try {
      const healthcareProviderId = this.getHealthcareProviderId();

      if (!healthcareProviderId) {
        return;
      }

      const params = {
        healthcareProviderId: healthcareProviderId,
        startDate: this.startDate(),
        endDate: this.endDate(),
        groupBy: this.groupBy(),
        projectId: environment.projectId,
        apiKeyId: environment.apiKeyId
      };

      this.usageService.getCompletionsUsage(params).subscribe({
        next: (data: OpenAIUsagePage) => {
          console.log('usageData', data);
          this.usagePage.set(data);
          this.usageBuckets.set(data.data || []);
          
          // Calculate totals from all buckets
          const totals = this.calculateTotalsFromBuckets(data.data || []);
          this.currentOpenAIUsage.set(totals);
        },
        error: (error) => {
          console.error('Error loading chat completions data:', error);
        }
      });
      
    } catch (error) {
      console.error('Error loading chat completions data:', error);
    }
  }

  calculateTotalsFromBuckets(buckets: OpenAIUsageBucket[]): OpenAIUsage {
    let totalInputTokens = 0;
    let totalRequests = 0;

    buckets.forEach(bucket => {
      bucket.results.forEach(result => {
        totalInputTokens += result.input_tokens || 0;
        totalRequests += result.num_model_requests || 0;
      });
    });

    return {
      totalInputTokens,
      totalRequests
    };
  }

  getTotalChatCompletions(): number {
    return this.currentOpenAIUsage()?.totalInputTokens || 0;
  }

  getTotalRequests(): number {
    return this.currentOpenAIUsage()?.totalRequests || 0;
  }

  getTotalTokens(): number {
    return this.currentOpenAIUsage()?.totalInputTokens || 0;
  }

  getBarHeight(inputTokens: number): number {
    if (!inputTokens || inputTokens <= 0) return 0;
    const maxTokens = this.maxInputTokens();
    return maxTokens > 0 ? (inputTokens / maxTokens) * 100 : 0;
  }

  showTooltipOnHover(point: {date: Date, inputTokens: number, requests: number}, event: MouseEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.tooltipData.set({
      ...point,
      x: event.clientX,
      y: event.clientY - 10
    });
    this.showTooltip.set(true);
  }

  hideTooltip() {
    this.showTooltip.set(false);
    this.tooltipData.set(null);
  }

  getBarPosition(date: Date): number {
    const startDate = new Date(this.startDate());
    const endDate = new Date(this.endDate());
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysFromStart = (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const position = (daysFromStart / totalDays) * 100;
    
    return Math.max(0, Math.min(100, position)); // Clamp between 0 and 100
  }

  getMaxValue(array: number[]): number {
    return Math.max(...array);
  }

  setPresetDateRange(preset: '7d' | '30d' | '90d' | '1y') {
    const today = new Date();
    const startDate = new Date(today);
    
    switch (preset) {
      case '7d':
        startDate.setDate(today.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(today.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(today.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
    }
    
    this.onDateRangeChange(
      startDate.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }

  onDateRangeChange(startDate: string, endDate: string) {
    this.startDate.set(startDate);
    this.endDate.set(endDate);
    
    this.loadChatCompletionsData();
    this.loadBudget();
  }

  onStartDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onDateRangeChange(target.value, this.endDate());
  }

  onEndDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onDateRangeChange(this.startDate(), target.value);
  }

  toggleDatePickerModal() {
    this.showDatePickerModal.set(!this.showDatePickerModal());
  }

  closeDatePickerModal() {
    this.showDatePickerModal.set(false);
  }

  formatNumber(num: number | null | undefined): string {
    if (num === null || num === undefined || isNaN(num)) {
      return '0';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Budget Modal Methods
  openBudgetEditModal() {
    this.showBudgetEditModal.set(true);
  }

  closeBudgetEditModal() {
    this.showBudgetEditModal.set(false);
  }

  openBudgetAlertModal() {
    this.showBudgetAlertModal.set(true);
  }

  closeBudgetAlertModal() {
    this.showBudgetAlertModal.set(false);
  }

  onBudgetFormChange(field: string, value: any) {
    const currentForm = this.budgetForm();
    this.budgetForm.set({
      ...currentForm,
      [field]: value
    });
  }

  onBudgetAlertFormChange(field: string, value: any) {
    const currentForm = this.budgetAlertForm();
    this.budgetAlertForm.set({
      ...currentForm,
      [field]: value
    });
  }

  async loadBudget() {
    try {
      const healthcareProviderId = this.getHealthcareProviderId();

      if (!healthcareProviderId) {
        this.loading.set(false);
        return;
      }

      this.usageService.getBudgetResponse(healthcareProviderId).subscribe((data) => {
        this.budget.set(data);
        // Populate budget form with current values
        this.budgetForm.set({
          budget: data.budget
        });
      });
      
    } catch (error) {
      this.errorHandler.showApiError(error);
    } finally {
      this.loading.set(false);
    }
  }

  onDateChange() {
    this.loadBudget();
    this.loadChatCompletionsData();
  }

  onGroupByChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.groupBy.set(target.value as 'day' | 'week' | 'month');
    this.loadBudget();
    this.loadChatCompletionsData();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  }

  formatFullDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getBudgetPercentage(): number {
    const budget = this.budget();
    if (!budget || budget.budget === 0) return 0;
    return (budget.budgetUsed / budget.budget) * 100;
  }

  getbudgetClass(): string {
    const percentage = this.getBudgetPercentage();
    if (percentage >= 95) return 'text-red-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-green-600';
  }

  getBudgetBarClass(): string {
    const percentage = this.getBudgetPercentage();
    if (percentage >= 95) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  async updateBudget() {
    try {
      const healthcareProviderId = this.getHealthcareProviderId();
      if (!healthcareProviderId) {
        this.error.set('No se pudo identificar el proveedor de salud');
        return;
      }

      const request: BudgetUpdateRequest = {
        subscriptionId: '',
        healthcareProviderId,
        budget: this.budgetForm().budget
      };

       this.usageService.updateBudget(request).subscribe({
         next: (data: BudgetUpdateResponse) => {
           this.success.set(data.message);
           this.closeBudgetEditModal();
           this.loadBudget(); // Reload budget data
         },
        error: (error) => {
          this.errorHandler.showApiError(error);
        }
      });
    } catch (error) {
      this.errorHandler.showApiError(error);
    }
  }

  async updateBudgetAlert() {
    try {
      const healthcareProviderId = this.getHealthcareProviderId();
      if (!healthcareProviderId) {
        this.error.set('No se pudo identificar el proveedor de salud');
        return;
      }

      const form = this.budgetAlertForm();

      const request: BudgetThresholdUpdateRequest = {
        healthcareProviderId,
        threshold: form.threshold / 100 || 0,
        emailSubject: form.emailSubject || undefined,
      };

      this.usageService.updateBudgetAlert(request).subscribe({
        next: (data: BudgetThresholdUpdateResponse) => {
          this.closeBudgetAlertModal();
          this.loadBudget(); // Reload budget status to get updated alerts
        },
        error: (error) => {
          this.errorHandler.showApiError(error);
        }
      });
    } catch (error) {
      this.errorHandler.showApiError(error);
    }
  }
}
