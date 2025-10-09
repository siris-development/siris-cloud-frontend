import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { UsageDataComponent } from '../components/usage-data.component';
import { HealthcareProvider } from '../../healthcare-providers/models/healthcare-provider.interface';

@Component({
  selector: 'app-usage-page',
  standalone: true,
  imports: [CommonModule, FormsModule, UsageDataComponent],
  templateUrl: './usage-page.component.html',
  styleUrls: ['./usage-page.component.css']
})
export class UsagePageComponent implements OnInit, OnDestroy {
  private errorHandler = inject(ErrorHandlerService);
  private storageListener?: (event: StorageEvent) => void;

  // Signals para el estado del componente
  selectedProjectId = signal<string>('');
  selectedProjectName = signal<string>('');
  selectedHealthcareProvider = signal<HealthcareProvider | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadHealthcareProvider();
    
    // Escuchar cambios en localStorage para actualizar cuando cambie el proveedor seleccionado
    this.storageListener = (event: StorageEvent) => {
      if (event.key === 'selectedHealthcareProvider') {
        this.loadHealthcareProvider();
      }
    };
    window.addEventListener('storage', this.storageListener);
  }

  ngOnDestroy() {
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }
  }

  private getHealthcareProviderFromStorage(): HealthcareProvider | null {
    const selectedProviderData = localStorage.getItem('selectedHealthcareProvider');
    if (selectedProviderData) {
      try {
        return JSON.parse(selectedProviderData);
      } catch (parseError) {
        return null;
      }
    }
    return null;
  }

  async loadHealthcareProvider() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const selectedProvider = this.getHealthcareProviderFromStorage();
      
      this.selectedHealthcareProvider.set(selectedProvider);
      this.selectedProjectId.set(selectedProvider?.id || '');
      this.selectedProjectName.set(selectedProvider?.name || selectedProvider?.identifier || 'Healthcare Provider');
    
    } catch (error) {
      this.errorHandler.showApiError(error);
    } finally {
      this.loading.set(false);
    }
  }

  clearError() {
    this.error.set(null);
  }
}
