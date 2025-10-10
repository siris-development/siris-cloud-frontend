import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { StorageUtils } from '@/shared/utils';
import { 
  HealthcareProvider, 
} from '@/features';
import { CreateDatabaseConfigModalComponent } from './create-database-config-modal/create-database-config-modal.component';
import { HealthcareProviderConfigService } from '@/services/healthcare-provider-config.service';
import { 
  CreateHealthcareProviderConfigRequest, 
  HealthcareProviderConfig, 
  QueryRequest,
  UpdateHealthcareProviderConfigRequest 
} from '@/features/healthcare-providers/models/healthcare-provider-config.interface';

@Component({
  selector: 'app-healthcare-provider-configs-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateDatabaseConfigModalComponent],
  templateUrl: './healthcare-provider-configs-page.component.html',
  styleUrls: ['./healthcare-provider-configs-page.component.css']
})
export class HealthcareProviderConfigsPageComponent implements OnInit {
  private healthcareProviderConfigService = inject(HealthcareProviderConfigService);
  route = inject(ActivatedRoute);

  // Signals para el estado del componente
  selectedProvider = signal<HealthcareProvider | null>(null);
  configs = signal<HealthcareProviderConfig[]>([]);
  loading = signal(false);
  loadingProvider = signal(false);
  loadingConfigs = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  providerNotFound = signal(false);

  // Estados para modales y formularios
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showQueryModal = signal(false);
  testingConnection = signal<string | null>(null);
  editingConfig = signal<HealthcareProviderConfig | null>(null);

  // Formularios
  formErrors = signal<{[key: string]: string}>({});
  validationErrors = signal<{[key: string]: string}>({});

  configForm = signal<CreateHealthcareProviderConfigRequest>({
    dbHost: '',
    dbPort: 5432,
    dbName: '',
    dbUsername: '',
    dbPassword: '',
    isActive: true,
    msPort: 3000,
    urlBotIa: ''
  });

  updateForm = signal<UpdateHealthcareProviderConfigRequest>({
    dbHost: '',
    dbPort: 5432,
    dbName: '',
    dbUsername: '',
    dbPassword: '',
    isActive: true,
    msPort: 3000,
    urlBotIa: ''
  });

  queryForm = signal<QueryRequest>({
    query: '',
    params: []
  });

  // Computed para estadísticas
  connectedConfigs = computed(() => {
    const configs = this.configs();
    return configs ? configs.filter(config => config.isActive).length : 0;
  });

  totalConfigs = computed(() => {
    const configs = this.configs();
    return configs ? configs.length : 0;
  });

  async ngOnInit() {
    // Obtener el ID del proveedor desde la ruta
    const providerId = this.route.snapshot.paramMap.get('providerId');
    if (providerId) {
      await this.loadProviderAndConfigs(providerId);
    } else {
      this.error.set('ID del proveedor no encontrado en la URL');
    }
  }

  async loadProviderAndConfigs(providerId: string) {
    this.loadingProvider.set(true);
    this.error.set(null);
    this.providerNotFound.set(false);

    try {
      // Cargar información del proveedor específico
      const provider = await firstValueFrom(
        this.healthcareProviderConfigService.getHealthcareProviderById(providerId)
      );

      this.selectedProvider.set(provider);

      // Cargar configuraciones del proveedor
      await this.loadConfigs(providerId);
    } catch (error) {
      console.error('Error loading provider and configs:', error);
      this.providerNotFound.set(true);
      this.selectedProvider.set(null);
      this.configs.set([]);
      this.handleApiError(error, 'Error al cargar el proveedor y sus configuraciones');
    } finally {
      this.loadingProvider.set(false);
    }
  }

  async loadConfigs(providerId: string) {
    this.loadingConfigs.set(true);
    this.error.set(null);

    try {
      const configs = await firstValueFrom(
        this.healthcareProviderConfigService.getHealthcareProviderConfigs(providerId)
      );
      // Asegurar que siempre sea un array
      this.configs.set(Array.isArray(configs) ? configs : []);
    } catch (error) {
      console.error('Error loading configs:', error);
      this.handleApiError(error, 'Error al cargar las configuraciones');
      // En caso de error, establecer array vacío
      this.configs.set([]);
    } finally {
      this.loadingConfigs.set(false);
    }
  }

  async createConfig() {
    if (!this.selectedProvider()) return;

    this.formErrors.set({});
    this.validationErrors.set({});
    this.loading.set(true);

    try {
      const newConfig = await firstValueFrom(
        this.healthcareProviderConfigService.createHealthcareProviderConfig(
          this.selectedProvider()!.id,
          this.configForm()
        )
      );

      this.configs.update(configs => [...configs, newConfig]);
      this.success.set('Configuración creada exitosamente');
      this.showCreateModal.set(false);
      this.resetForm();
    } catch (error: any) {
      console.error('Error creating config:', error);
      this.handleApiError(error, 'Error al crear la configuración');
    } finally {
      this.loading.set(false);
    }
  }

  async updateConfig() {
    if (!this.selectedProvider() || !this.editingConfig()) return;

    this.formErrors.set({});
    this.validationErrors.set({});
    this.loading.set(true);

    try {
      const updatedConfig = await firstValueFrom(
        this.healthcareProviderConfigService.updateHealthcareProviderConfig(
          this.selectedProvider()!.id,
          this.editingConfig()!.id,
          this.updateForm()
        )
      );

      this.configs.update(configs => 
        configs.map(config => 
          config.id === this.editingConfig()!.id ? updatedConfig : config
        )
      );
      this.success.set('Configuración actualizada exitosamente');
      this.showEditModal.set(false);
      this.resetUpdateForm();
    } catch (error: any) {
      console.error('Error updating config:', error);
      this.handleApiError(error, 'Error al actualizar la configuración');
    } finally {
      this.loading.set(false);
    }
  }

  async testConnection(configId: string) {
    if (!this.selectedProvider()) return;

    this.testingConnection.set(configId);
    this.error.set(null);
    this.success.set(null);

    try {
      const result = await firstValueFrom(
        this.healthcareProviderConfigService.testConnection(
          this.selectedProvider()!.id,
          configId
        )
      );

      if (result.success) {
        this.success.set(`Conexión exitosa - Tiempo de respuesta: ${result.details.responseTime}ms`);
      } else {
        this.error.set(`Error de conexión: ${result.message}`);
      }
    } catch (error: any) {
      console.error('Error testing connection:', error);
      this.handleApiError(error, 'Error al probar la conexión');
    } finally {
      this.testingConnection.set(null);
    }
  }

  async executeQuery() {
    if (!this.selectedProvider() || !this.queryForm().query.trim()) return;

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      // Buscar la primera configuración activa
      const activeConfig = this.configs().find(config => config.isActive);
      if (!activeConfig) {
        this.error.set('No hay configuraciones activas para ejecutar la consulta');
        return;
      }

      const result = await firstValueFrom(
        this.healthcareProviderConfigService.executeQuery(
          this.selectedProvider()!.id,
          activeConfig.id,
          this.queryForm()
        )
      );

      if (result.success) {
        this.success.set(`Consulta ejecutada exitosamente. Resultados: ${result.data.length} registros`);
        console.log('Query results:', result.data);
      } else {
        this.error.set(`Error en la consulta: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Error executing query:', error);
      this.handleApiError(error, 'Error al ejecutar la consulta');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteConfig(configId: string) {
    if (!this.selectedProvider()) return;

    if (!confirm('¿Está seguro de que desea eliminar esta configuración?')) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      const result = await firstValueFrom(
        this.healthcareProviderConfigService.deleteHealthcareProviderConfig(
          this.selectedProvider()!.id,
          configId
        )
      );

      this.configs.update(configs => configs.filter(config => config.id !== configId));
      this.success.set(`Configuración eliminada exitosamente (ID: ${result.deletedId})`);
    } catch (error: any) {
      console.error('Error deleting config:', error);
      this.handleApiError(error, 'Error al eliminar la configuración');
    } finally {
      this.loading.set(false);
    }
  }

  async toggleConfigStatus(configId: string, isActive: boolean) {
    if (!this.selectedProvider()) return;

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      const updatedConfig = await firstValueFrom(
        this.healthcareProviderConfigService.toggleConfigStatus(
          this.selectedProvider()!.id,
          configId,
          isActive
        )
      );

      this.configs.update(configs => 
        configs.map(config => 
          config.id === configId ? updatedConfig : config
        )
      );
      this.success.set(`Configuración ${isActive ? 'activada' : 'desactivada'} exitosamente`);
    } catch (error: any) {
      console.error('Error toggling config status:', error);
      this.handleApiError(error, 'Error al cambiar el estado de la configuración');
    } finally {
      this.loading.set(false);
    }
  }

  openCreateModal() {
    this.resetForm();
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.resetForm();
  }

  openEditModal(config: HealthcareProviderConfig) {
    this.editingConfig.set(config);
    this.updateForm.set({
      dbHost: config.dbHost,
      dbPort: config.dbPort,
      dbName: config.dbName,
      dbUsername: config.dbUsername,
      dbPassword: '', // No mostrar contraseña por seguridad
      isActive: config.isActive,
      msPort: config.msPort || 3000,
      urlBotIa: config.urlBotIa || ''
    });
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingConfig.set(null);
    this.resetUpdateForm();
  }

  openQueryModal() {
    this.queryForm.set({ query: '', params: [] });
    this.showQueryModal.set(true);
  }

  closeQueryModal() {
    this.showQueryModal.set(false);
    this.queryForm.set({ query: '', params: [] });
  }

  resetForm() {
    this.configForm.set({
      dbHost: '',
      dbPort: 5432,
      dbName: '',
      dbUsername: '',
      dbPassword: '',
      isActive: true,
      msPort: 3000,
      urlBotIa: ''
    });
    this.formErrors.set({});
    this.validationErrors.set({});
  }

  resetUpdateForm() {
    this.updateForm.set({
      dbHost: '',
      dbPort: 5432,
      dbName: '',
      dbUsername: '',
      dbPassword: '',
      isActive: true,
      msPort: 3000,
      urlBotIa: ''
    });
    this.formErrors.set({});
    this.validationErrors.set({});
  }

  clearMessages() {
    this.error.set(null);
    this.success.set(null);
  }

  /**
   * Maneja errores de la API con información detallada
   */
  private handleApiError(error: any, defaultMessage: string) {
    console.error('API Error:', error);
    
    if (error.error) {
      const apiError = error.error;
      
      // Manejar errores de validación (422)
      if (apiError.code === 'UNPROCESSABLE_ENTITY' && apiError.details?.validationErrors) {
        const validationErrors: {[key: string]: string} = {};
        apiError.details.validationErrors.forEach((err: any) => {
          validationErrors[err.field] = err.message;
        });
        this.validationErrors.set(validationErrors);
        this.error.set('Errores de validación encontrados');
        return;
      }
      
      // Manejar errores específicos de la API
      if (apiError.message) {
        this.error.set(apiError.message);
        return;
      }
      
      // Manejar errores con detalles
      if (apiError.details?.errors) {
        this.error.set(apiError.details.errors.join(', '));
        return;
      }
    }
    
    // Error genérico
    this.error.set(defaultMessage);
  }
}
