import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateHealthcareProviderConfigRequest } from '@/features/healthcare-providers/models/healthcare-provider-config.interface';

@Component({
  selector: 'app-create-database-config-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-database-config-modal.component.html',
  styleUrls: ['./create-database-config-modal.component.css']
})
export class CreateDatabaseConfigModalComponent {
  @Input() configForm = signal<CreateHealthcareProviderConfigRequest>({
    dbHost: '',
    dbPort: 5432,
    dbName: '',
    dbUsername: '',
    dbPassword: '',
    isActive: true,
    msPort: 3000,
    urlBotIa: ''
  });

  @Input() formErrors = signal<{[key: string]: string}>({});
  @Input() loading = signal(false);

  @Output() configFormChange = new EventEmitter<CreateHealthcareProviderConfigRequest>();
  @Output() formErrorsChange = new EventEmitter<{[key: string]: string}>();
  @Output() createConfig = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  onConfigFormChange(value: CreateHealthcareProviderConfigRequest) {
    this.configForm.set(value);
    this.configFormChange.emit(value);
  }

  onFieldChange(field: keyof CreateHealthcareProviderConfigRequest, value: any) {
    const currentForm = this.configForm();
    const updatedForm = { ...currentForm, [field]: value };
    this.configForm.set(updatedForm);
    this.configFormChange.emit(updatedForm);
  }

  onFormErrorsChange(value: {[key: string]: string}) {
    this.formErrors.set(value);
    this.formErrorsChange.emit(value);
  }

  onSubmit() {
    this.createConfig.emit();
  }

  onClose() {
    this.closeModal.emit();
  }

  getFieldError(field: string): string {
    return this.formErrors()[field] || '';
  }

  hasFieldError(field: string): boolean {
    return !!this.getFieldError(field);
  }
}
