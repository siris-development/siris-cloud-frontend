import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthcareProviderService } from '../../../../../services/healthcare-provider.service';
import { ErrorHandlerService } from '../../../../../shared/services/error-handler.service';
import { AuthService } from '../../../../../auth/auth.service';
import { 
  HealthcareProvider, 
  CreateHealthcareProviderRequest, 
  UpdateHealthcareProviderRequest 
} from '../../../../../dashboard/interfaces/healthcare-provider.interface';

@Component({
  selector: 'app-healthcare-provider-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './healthcare-provider-modal.component.html',
  styleUrls: ['./healthcare-provider-modal.component.css']
})
export class HealthcareProviderModalComponent {
  private healthcareProviderService = inject(HealthcareProviderService);
  private errorHandler = inject(ErrorHandlerService);
  private authService = inject(AuthService);

  // Inputs
  isOpen = input<boolean>(false);
  provider = input<HealthcareProvider | null>(null);
  
  // Outputs
  onClose = output<void>();
  onSuccess = output<void>();

  // Estado del componente
  loading = signal<boolean>(false);
  
  // Determinar si es modo edición o creación
  isEditMode = signal<boolean>(false);
  
  // Formulario
  formData = signal<{
    identifier: string;
    name: string;
  }>({
    identifier: '',
    name: ''
  });

  // Errores de validación
  formErrors = signal<{
    identifier?: string;
    name?: string;
  }>({});

  constructor() {
    // Effect para inicializar el formulario cuando cambie el provider
    effect(() => {
      const provider = this.provider();
      if (provider) {
        this.isEditMode.set(true);
        this.formData.set({
          identifier: provider.identifier || '',
          name: provider.name || ''
        });
      } else {
        this.isEditMode.set(false);
        this.formData.set({
          identifier: '',
          name: ''
        });
      }
    });
  }

  // Métodos de validación
  validateForm(): boolean {
    const errors: { identifier?: string; name?: string } = {};
    let isValid = true;

    // Validar identificador
    const identifier = this.formData().identifier?.trim();
    if (!identifier) {
      errors.identifier = 'El identificador es requerido';
      isValid = false;
    } else if (identifier.length < 3) {
      errors.identifier = 'El identificador debe tener al menos 3 caracteres';
      isValid = false;
    } else if (!/^[a-zA-Z0-9-_]+$/.test(identifier)) {
      errors.identifier = 'El identificador solo puede contener letras, números, guiones y guiones bajos';
      isValid = false;
    }

    // Validar nombre
    const name = this.formData().name?.trim();
    if (!name) {
      errors.name = 'El nombre es requerido';
      isValid = false;
    } else if (name.length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
      isValid = false;
    } else if (name.length > 100) {
      errors.name = 'El nombre no puede exceder 100 caracteres';
      isValid = false;
    }

    this.formErrors.set(errors);
    return isValid;
  }

  clearFieldError(field: 'identifier' | 'name') {
    const errors = { ...this.formErrors() };
    delete errors[field];
    this.formErrors.set(errors);
  }

  // Métodos de acción
  closeModal() {
    this.resetForm();
    this.onClose.emit();
  }

  resetForm() {
    this.formData.set({
      identifier: '',
      name: ''
    });
    this.formErrors.set({});
    this.loading.set(false);
  }

  // Método principal que maneja tanto creación como edición
  submitForm() {
    // Validar formulario antes de enviar
    if (!this.validateForm()) {
      return;
    }

    this.loading.set(true);

    if (this.isEditMode()) {
      this.updateProvider();
    } else {
      this.createProvider();
    }
  }

  createProvider() {
    const data: CreateHealthcareProviderRequest = {
      ...this.formData(),
      tenantId: this.authService.currentTenant()?.id || ''
    };

    this.healthcareProviderService.createHealthcareProvider(data).subscribe({
      next: () => {
        this.errorHandler.showSuccess('PTS creado exitosamente');
        this.resetForm();
        this.onSuccess.emit();
      },
      error: (error) => {
        this.errorHandler.showApiError(error);
        this.loading.set(false);
      }
    });
  }

  updateProvider() {
    const provider = this.provider();
    if (!provider) return;

    const updateData: UpdateHealthcareProviderRequest = {
      identifier: this.formData().identifier,
      name: this.formData().name
    };

    this.healthcareProviderService.updateHealthcareProvider(provider.id, updateData).subscribe({
      next: () => {
        this.errorHandler.showSuccess('PTS actualizado exitosamente');
        this.resetForm();
        this.onSuccess.emit();
      },
      error: (error) => {
        this.errorHandler.showApiError(error);
        this.loading.set(false);
      }
    });
  }

  // Getters para el template
  get modalTitle(): string {
    return this.isEditMode() ? 'Editar PTS' : 'Crear Nuevo PTS';
  }

  get submitButtonText(): string {
    return this.isEditMode() ? 'Actualizar PTS' : 'Crear PTS';
  }

  get loadingText(): string {
    return this.isEditMode() ? 'Actualizando...' : 'Creando...';
  }
}
