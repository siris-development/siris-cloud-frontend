import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateDatabaseConfigRequest } from '@/features';
import { StorageUtils } from '@/shared/utils';

@Component({
  selector: 'app-create-database-config-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-database-config-modal.component.html',
  styleUrls: ['./create-database-config-modal.component.css'],
})
export class CreateDatabaseConfigModalComponent {
  @Input() isVisible = false;
  @Input() loading = false;
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateDatabaseConfigRequest>();

  // Formulario
  newConfig = signal<CreateDatabaseConfigRequest>({
    tenantId: StorageUtils.getTenantIdFromStorage(),
    systemName: '',
    nit: '',
    host: '',
    port: 3306,
    databaseName: '',
    username: '',
    password: ''
  });

  // Validaciones
  formErrors = signal<{[key: string]: string}>({});

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  onCreate() {
    if (this.validateForm()) {
      this.create.emit(this.newConfig());
    }
  }


  resetForm() {
    this.newConfig.set({
      tenantId: StorageUtils.getTenantIdFromStorage(),
      systemName: '',
      nit: '',
      host: '',
      port: 3306,
      databaseName: '',
      username: '',
      password: ''
    });
    this.formErrors.set({});
  }

  // Métodos de validación
  validateForm(): boolean {
    const errors: {[key: string]: string} = {};
    const config = this.newConfig();

    // Validar nombre del sistema
    if (!config['systemName'] || config['systemName'].trim().length === 0) {
      errors['systemName'] = 'El nombre del sistema es requerido';
    } else if (config['systemName'].length < 3) {
      errors['systemName'] = 'El nombre del sistema debe tener al menos 3 caracteres';
    }

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
