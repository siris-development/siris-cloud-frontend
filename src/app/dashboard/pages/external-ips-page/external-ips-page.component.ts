import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ExternalIpConfigService } from '../../../services/external-ip-config.service';
import {
  ExternalIpConfig,
  CreateExternalIpConfigRequest,
  CreateDatabaseConfigRequest,
  CreateCronHisCitasConfigRequest,
  ConnectionTestResponse,
  QueryRequest,
  CronHisCitasStats
} from '../../interfaces/external-ip-config.interface';
import { CreateDatabaseConfigModalComponent } from './components/create-database-config-modal/create-database-config-modal.component';
import { StorageUtils } from '@/shared/utils';

@Component({
  selector: 'app-external-ips-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateDatabaseConfigModalComponent],
  templateUrl: './external-ips-page.component.html',
  styleUrls: ['./external-ips-page.component.css']
})
export class ExternalIpsPageComponent implements OnInit {
  private externalIpService = inject(ExternalIpConfigService);

  // Signals para el estado del componente
  configs = signal<ExternalIpConfig[]>([]);
  cronHisConfig = signal<ExternalIpConfig | null>(null);
  cronHisStats = signal<CronHisCitasStats | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // Estados para modales y formularios
  showCreateModal = signal(false);
  showCronHisModal = signal(false);
  showQueryModal = signal(false);
  showStatsModal = signal(false);
  testingConnection = signal<string | null>(null);

  // Formularios
  formErrors = signal<{[key: string]: string}>({});

  cronHisConfigForm = signal<CreateCronHisCitasConfigRequest>({
    tenantId: StorageUtils.getTenantIdFromStorage(),
    nit: '',
    host: '',
    port: 3306,
    databaseName: '',
    username: '',
    password: ''
  });

  queryForm = signal<QueryRequest>({
    query: '',
    params: []
  });

  // Computed para estadísticas
  connectedConfigs = computed(() => 
    this.configs().filter(config => config.connectionStatus === 'connected').length
  );

  failedConfigs = computed(() => 
    this.configs().filter(config => config.connectionStatus === 'failed').length
  );

  testingConfigs = computed(() => 
    this.configs().filter(config => config.connectionStatus === 'testing').length
  );

  unknownConfigs = computed(() => 
    this.configs().filter(config => config.connectionStatus === 'unknown').length
  );

  totalConfigs = computed(() => this.configs().length);

  ngOnInit() {
    this.loadConfigs();
    this.loadCronHisConfig();
  }

  async loadConfigs() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const configs = await firstValueFrom(this.externalIpService.getConfigs());
      this.configs.set(configs || []);
    } catch (err) {
      this.error.set('Error al cargar las configuraciones');
      console.error('Error loading configs:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async loadCronHisConfig() {
    try {
      const config = await firstValueFrom(this.externalIpService.getCronHisCitasConfig());
      this.cronHisConfig.set(config || null);
    } catch (err) {
      console.error('Error loading CronHis config:', err);
    }
  }

  async loadCronHisStats() {
    try {
      const stats = await firstValueFrom(this.externalIpService.getCronHisCitasStats());
      this.cronHisStats.set(stats || null);
    } catch (err) {
      console.error('Error loading CronHis stats:', err);
    }
  }

  async testConnection(configId: string) {
    this.testingConnection.set(configId);
    
    try {
      const result = await firstValueFrom(this.externalIpService.testConnection(configId));
      this.success.set(`Conexión exitosa: ${result?.message}`);
      
      // Recargar configuraciones para actualizar el estado
      await this.loadConfigs();
    } catch (err) {
      this.error.set('Error al probar la conexión');
      console.error('Error testing connection:', err);
    } finally {
      this.testingConnection.set(null);
    }
  }

  async deployConfig(nit: string) {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      // Aquí implementarías la lógica de despliegue
      // Por ahora, simulamos una operación exitosa
      await firstValueFrom(this.externalIpService.deployConfig(nit));
      
      // Recargar configuraciones para actualizar el estado
      await this.loadConfigs();
    } catch (err) {
      this.error.set('Error al desplegar la configuración');
      console.error('Error deploying config:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async createConfig(configData: CreateDatabaseConfigRequest) {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      await firstValueFrom(this.externalIpService.createConfig(configData));
      this.success.set('Configuración creada exitosamente');
      this.showCreateModal.set(false);
      await this.loadConfigs();
    } catch (err) {
      this.error.set('Error al crear la configuración');
      console.error('Error creating config:', err);
    } finally {
      this.loading.set(false);
    }
  }

  onCloseCreateModal() {
    this.showCreateModal.set(false);
  }

  async createCronHisConfig() {
    // Validar formulario antes de enviar
    if (!this.validateCronHisForm()) {
      this.error.set('Por favor, corrige los errores en el formulario');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    
    try {
      await firstValueFrom(this.externalIpService.createCronHisCitasConfig(this.cronHisConfigForm()));
      this.success.set('Configuración de CronHis Citas creada exitosamente');
      this.showCronHisModal.set(false);
      this.resetCronHisForm();
      this.formErrors.set({});
      await this.loadCronHisConfig();
    } catch (err) {
      this.error.set('Error al crear la configuración de CronHis Citas');
      console.error('Error creating CronHis config:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async executeQuery() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const result = await firstValueFrom(this.externalIpService.executeCronHisCitasQuery(this.queryForm()));
      this.success.set('Consulta ejecutada exitosamente');
      console.log('Query result:', result);
      // Aquí podrías mostrar los resultados en un modal o tabla
    } catch (err) {
      this.error.set('Error al ejecutar la consulta');
      console.error('Error executing query:', err);
    } finally {
      this.loading.set(false);
    }
  }


  generateCronHisConnectionString() {
    const form = this.cronHisConfigForm();
    if (form.host && form.port && form.databaseName && form.username && form.password) {
      const connectionString = `postgresql://${form.username}:${form.password}@${form.host}:${form.port}/${form.databaseName}`;
      this.cronHisConfigForm.update(config => ({ ...config, connectionString }));
    }
  }

  getConnectionStatusClass(status: string): string {
    switch (status) {
      case 'connected': return 'text-green-500 bg-green-100';
      case 'failed': return 'text-red-500 bg-red-100';
      case 'testing': return 'text-yellow-500 bg-yellow-100';
      case 'unknown': return 'text-gray-500 bg-gray-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  }

  getConnectionStatusText(status: string): string {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'failed': return 'Falló';
      case 'testing': return 'Probando';
      case 'unknown': return 'Desconocido';
      default: return 'Desconocido';
    }
  }


  resetCronHisForm() {
    this.cronHisConfigForm.set({
      tenantId: StorageUtils.getTenantIdFromStorage(),
      nit: '',
      host: '',
      port: 3306,
      databaseName: '',
      username: '',
      password: ''
    });
    this.formErrors.set({});
  }

  clearMessages() {
    this.error.set(null);
    this.success.set(null);
  }


  validateCronHisForm(): boolean {
    const errors: {[key: string]: string} = {};
    const config = this.cronHisConfigForm();

    // Validar NIT
    if (!config['nit'] || config['nit'].trim().length === 0) {
      errors['nit'] = 'El NIT es requerido';
    } else if (!/^\d{6,15}$/.test(config['nit'].replace(/[-\s]/g, ''))) {
      errors['nit'] = 'El NIT debe contener entre 6 y 15 dígitos';
    }

    // Validar host
    if (!config['host'] || config['host'].trim().length === 0) {
      errors['host'] = 'El host de la base de datos es requerido';
    } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(config['host']) && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(config['host'])) {
      errors['host'] = 'El host debe ser una IP válida o un servidor de base de datos válido';
    }

    // Validar puerto
    if (!config['port'] || config['port'] < 1 || config['port'] > 65535) {
      errors['port'] = 'El puerto debe estar entre 1 y 65535';
    }

    // Validar nombre de base de datos
    if (!config['databaseName'] || config['databaseName'].trim().length === 0) {
      errors['databaseName'] = 'El nombre de la base de datos es requerido';
    } else if (!/^[a-zA-Z0-9_]+$/.test(config['databaseName'])) {
      errors['databaseName'] = 'El nombre de la base de datos solo puede contener letras, números y guiones bajos';
    }

    // Validar usuario
    if (!config['username'] || config['username'].trim().length === 0) {
      errors['username'] = 'El usuario de la base de datos es requerido';
    } else if (config['username'].length < 3) {
      errors['username'] = 'El usuario debe tener al menos 3 caracteres';
    }

    // Validar contraseña
    if (!config['password'] || config['password'].length === 0) {
      errors['password'] = 'La contraseña de la base de datos es requerida';
    } else if (config['password'].length < 6) {
      errors['password'] = 'La contraseña debe tener al menos 6 caracteres';
    }

    this.formErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  getFieldError(fieldName: string): string {
    return this.formErrors()[fieldName] || '';
  }

  hasFieldError(fieldName: string): boolean {
    return !!this.formErrors()[fieldName];
  }
}
