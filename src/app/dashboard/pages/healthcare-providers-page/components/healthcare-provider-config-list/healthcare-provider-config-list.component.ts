import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthcareProviderService } from '../../../../../services/healthcare-provider.service';
import { AuthService } from '../../../../../auth/auth.service';
import { ErrorHandlerService } from '../../../../../shared/services/error-handler.service';
import {
  HealthcareProvider,
  HealthcareProviderConfig,
  CreateHealthcareProviderConfigRequest,
  UpdateHealthcareProviderConfigRequest
} from '../../../../../dashboard/interfaces/healthcare-provider.interface';

@Component({
  selector: 'app-healthcare-provider-config-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './healthcare-provider-config-list.component.html',
  styleUrls: ['./healthcare-provider-config-list.component.css']
})
export class HealthcareProviderConfigListComponent implements OnInit {
  private healthcareProviderService = inject(HealthcareProviderService);
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlerService);

  // Estado del componente
  providers = signal<HealthcareProvider[]>([]);
  configs = signal<HealthcareProviderConfig[]>([]);
  loading = signal<boolean>(false);
  showCreateModal = signal<boolean>(false);
  showEditModal = signal<boolean>(false);
  selectedConfig = signal<HealthcareProviderConfig | null>(null);
  selectedProviderId = signal<string>('');

  // Formulario para crear/editar
  formData = signal<CreateHealthcareProviderConfigRequest>({
    idPts: '',
    dbHost: '',
    dbPort: 5432,
    dbName: '',
    dbUsername: '',
    dbPassword: '',
    isActive: true,
    msPort: 3000,
    urlBotIa: ''
  });

  ngOnInit() {
    this.loadProviders();
  }

  loadProviders() {

    this.loading.set(true);
    this.healthcareProviderService.getMyHealthcareProviders().subscribe({
      next: (providers) => {
        this.providers.set(providers);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorHandler.showApiError(error);
        this.loading.set(false);
      }
    });
  }

  loadConfigs(providerId: string) {
    this.loading.set(true);
    this.healthcareProviderService.getHealthcareProviderConfigsByProvider(providerId).subscribe({
      next: (configs) => {
        this.configs.set(configs);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorHandler.showApiError(error);
        this.loading.set(false);
      }
    });
  }

  onProviderChange(providerId: string) {
    this.selectedProviderId.set(providerId);
    if (providerId) {
      this.loadConfigs(providerId);
    } else {
      this.configs.set([]);
    }
  }

  openCreateModal() {
    if (!this.selectedProviderId()) {
      this.errorHandler.showError('Debe seleccionar un proveedor primero');
      return;
    }

    this.formData.set({
      idPts: this.selectedProviderId(),
      dbHost: '',
      dbPort: 5432,
      dbName: '',
      dbUsername: '',
      dbPassword: '',
      isActive: true,
      msPort: 3000,
      urlBotIa: ''
    });
    this.showCreateModal.set(true);
  }

  openEditModal(config: HealthcareProviderConfig) {
    this.selectedConfig.set(config);
    this.formData.set({
      idPts: config.idPts,
      dbHost: config.dbHost || '',
      dbPort: config.dbPort || 5432,
      dbName: config.dbName || '',
      dbUsername: config.dbUsername || '',
      dbPassword: config.dbPassword || '',
      isActive: config.isActive,
      msPort: config.msPort || 3000,
      urlBotIa: config.urlBotIa || ''
    });
    this.showEditModal.set(true);
  }

  closeModals() {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.selectedConfig.set(null);
    this.formData.set({
      idPts: '',
      dbHost: '',
      dbPort: 5432,
      dbName: '',
      dbUsername: '',
      dbPassword: '',
      isActive: true,
      msPort: 3000,
      urlBotIa: ''
    });
  }

  createConfig() {
    this.loading.set(true);
    this.healthcareProviderService.createHealthcareProviderConfig(this.formData()).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Configuración creada exitosamente');
        this.closeModals();
        this.loadConfigs(this.selectedProviderId());
      },
      error: (error) => {
        this.errorHandler.showApiError(error);
        this.loading.set(false);
      }
    });
  }

  updateConfig() {
    const config = this.selectedConfig();
    if (!config) return;

    const updateData: UpdateHealthcareProviderConfigRequest = {
      dbHost: this.formData().dbHost,
      dbPort: this.formData().dbPort,
      dbName: this.formData().dbName,
      dbUsername: this.formData().dbUsername,
      dbPassword: this.formData().dbPassword,
      isActive: this.formData().isActive,
      msPort: this.formData().msPort,
      urlBotIa: this.formData().urlBotIa
    };

    this.loading.set(true);
    this.healthcareProviderService.updateHealthcareProviderConfig(config.id, updateData).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Configuración actualizada exitosamente');
        this.closeModals();
        this.loadConfigs(this.selectedProviderId());
      },
      error: (error) => {
        this.errorHandler.showApiError(error);
        this.loading.set(false);
      }
    });
  }

  deleteConfig(config: HealthcareProviderConfig) {
    if (!confirm(`¿Está seguro de que desea eliminar esta configuración?`)) {
      return;
    }

    this.loading.set(true);
    this.healthcareProviderService.deleteHealthcareProviderConfig(config.id).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Configuración eliminada exitosamente');
        this.loadConfigs(this.selectedProviderId());
      },
      error: (error) => {
        this.errorHandler.showApiError(error);
        this.loading.set(false);
      }
    });
  }

  getProviderName(providerId: string): string {
    const provider = this.providers().find(p => p.id === providerId);
    return provider?.name || provider?.identifier || 'Proveedor desconocido';
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Activo' : 'Inactivo';
  }
}
