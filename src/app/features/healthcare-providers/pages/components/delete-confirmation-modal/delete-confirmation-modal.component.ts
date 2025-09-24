import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthcareProvider } from '@/features';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent {
  // Inputs
  isOpen = input<boolean>(false);
  provider = input<HealthcareProvider | null>(null);
  loading = input<boolean>(false);
  
  // Outputs
  onClose = output<void>();
  onConfirm = output<void>();

  // Métodos de acción
  closeModal() {
    this.onClose.emit();
  }

  confirmDelete() {
    this.onConfirm.emit();
  }

  // Getters para el template
  get providerName(): string {
    const provider = this.provider();
    return provider?.name || provider?.identifier || 'este proveedor';
  }

  get providerIdentifier(): string {
    const provider = this.provider();
    return provider?.identifier || '';
  }

  get hasConfigurations(): boolean {
    const provider = this.provider();
    return (provider?.ptMs?.length || 0) > 0;
  }

  get configurationsCount(): number {
    const provider = this.provider();
    return provider?.ptMs?.length || 0;
  }
}
