import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthcareProviderService } from '../../../../../services/healthcare-provider.service';
import { AuthService } from '../../../../../auth/auth.service';
import { ErrorHandlerService } from '../../../../../shared/services/error-handler.service';
import { HealthcareProvider } from '../../../../../dashboard/interfaces/healthcare-provider.interface';
import { HealthcareProviderModalComponent } from '../healthcare-provider-modal/healthcare-provider-modal.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-healthcare-provider-list',
  standalone: true,
  imports: [CommonModule, HealthcareProviderModalComponent, DeleteConfirmationModalComponent],
  templateUrl: './healthcare-provider-list.component.html',
  styleUrls: ['./healthcare-provider-list.component.css']
})
export class HealthcareProviderListComponent implements OnInit {
  private healthcareProviderService = inject(HealthcareProviderService);
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlerService);

  // Estado del componente
  providers = signal<HealthcareProvider[]>([]);
  filteredProviders = signal<HealthcareProvider[]>([]);
  loading = signal<boolean>(false);
  showModal = signal<boolean>(false);
  selectedProvider = signal<HealthcareProvider | null>(null);
  
  // Estado de búsqueda
  searchQuery = signal<string>('');
  searchType = signal<'all' | 'identifier' | 'name'>('all');
  
  // Estado del modal de confirmación
  showDeleteModal = signal<boolean>(false);
  providerToDelete = signal<HealthcareProvider | null>(null);
  deleting = signal<boolean>(false);

  ngOnInit() {
    this.loadProviders();
  }

  loadProviders() {
    this.loading.set(true);
    this.healthcareProviderService.getMyHealthcareProviders().subscribe({
      next: (providers) => {
        this.providers.set(providers);
        this.filteredProviders.set(providers);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorHandler.showApiError(error);
        this.loading.set(false);
      }
    });
  }

  // Métodos de búsqueda
  onSearchQueryChange(query: string) {
    this.searchQuery.set(query);
    this.performSearch();
  }

  onSearchTypeChange(type: 'all' | 'identifier' | 'name') {
    this.searchType.set(type);
    this.performSearch();
  }

  performSearch() {
    const query = this.searchQuery().toLowerCase().trim();
    const type = this.searchType();
    const allProviders = this.providers();

    if (!query) {
      this.filteredProviders.set(allProviders);
      return;
    }

    const filtered = allProviders.filter(provider => {
      switch (type) {
        case 'identifier':
          return provider.identifier?.toLowerCase().includes(query) || false;
        case 'name':
          return provider.name?.toLowerCase().includes(query) || false;
        case 'all':
        default:
          return (
            provider.identifier?.toLowerCase().includes(query) ||
            provider.name?.toLowerCase().includes(query) ||
            false
          );
      }
    });

    this.filteredProviders.set(filtered);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchType.set('all');
    this.filteredProviders.set(this.providers());
  }

  openCreateModal() {
    this.selectedProvider.set(null);
    this.showModal.set(true);
  }

  openEditModal(provider: HealthcareProvider) {
    this.selectedProvider.set(provider);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedProvider.set(null);
  }

  onModalSuccess() {
    this.closeModal();
    this.loadProviders();
  }

  // Métodos para el modal de confirmación
  openDeleteModal(provider: HealthcareProvider) {
    this.providerToDelete.set(provider);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.providerToDelete.set(null);
    this.deleting.set(false);
  }

  confirmDelete() {
    const provider = this.providerToDelete();
    if (!provider) return;

    this.deleting.set(true);
    this.healthcareProviderService.deleteHealthcareProvider(provider.id).subscribe({
      next: () => {
        this.errorHandler.showSuccess('PTS eliminado exitosamente');
        this.closeDeleteModal();
        this.loadProviders();
      },
      error: (error) => {
        this.errorHandler.showApiError(error);
        this.deleting.set(false);
      }
    });
  }

  getConfigurationsCount(provider: HealthcareProvider): number {
    return provider.ptMs?.length || 0;
  }
}
