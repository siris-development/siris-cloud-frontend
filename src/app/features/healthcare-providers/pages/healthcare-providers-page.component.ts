import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HealthcareProviderService } from '../../../services/healthcare-provider.service';
import { HealthcareProvider } from '@/features';
import { HealthcareProviderModalComponent } from './components/healthcare-provider-modal/healthcare-provider-modal.component';
import { DeleteConfirmationModalComponent } from './components/delete-confirmation-modal/delete-confirmation-modal.component';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';

@Component({
  selector: 'app-healthcare-providers',
  standalone: true,
  imports: [CommonModule, HealthcareProviderModalComponent, DeleteConfirmationModalComponent],
  templateUrl: './healthcare-providers-page.component.html',
  styleUrls: ['./healthcare-providers-page.component.css']
})
export class HealthcareProvidersPageComponent implements OnInit {
  private healthcareProviderService = inject(HealthcareProviderService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  // Estado del componente
  providers = signal<HealthcareProvider[]>([]);
  filteredProviders = signal<HealthcareProvider[]>([]);
  loading = signal<boolean>(false);
  showProviderModal = signal<boolean>(false);
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

  // Métodos para estadísticas
  getTotalProviders(): number {
    return this.providers().length;
  }

  getTotalConfigurations(): number {
    return this.providers().reduce((total, provider) => {
      return total + (provider.ptMs?.length || 0);
    }, 0);
  }

  getActiveModules(): number {
    // Por ahora retornamos un número fijo, pero esto podría calcularse dinámicamente
    return 4; // Dashboard, IPs Externas, WhatsApp, Pagos
  }

  getConfigurationsCount(provider: HealthcareProvider): number {
    return provider.ptMs?.length || 0;
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

  // Métodos para navegación a módulos
  navigateToModule(module: string, provider: HealthcareProvider) {
    // Guardar el proveedor seleccionado en el localStorage para uso en otros módulos
    localStorage.setItem('selectedHealthcareProvider', JSON.stringify(provider));
    
    switch (module) {
      case 'dashboard':
        this.router.navigate(['/dashboard']);
        break;
      case 'external-ips':
        this.router.navigate(['/external-ips']);
        break;
      case 'whatsapp':
        this.router.navigate(['/whatsapp']);
        break;
      case 'payment':
        this.router.navigate(['/payment']);
        break;
      default:
        console.warn(`Módulo ${module} no reconocido`);
    }
  }

  // Métodos para el modal de proveedor
  openCreateProviderModal() {
    this.selectedProvider.set(null);
    this.showProviderModal.set(true);
  }

  openEditProviderModal(provider: HealthcareProvider) {
    this.selectedProvider.set(provider);
    this.showProviderModal.set(true);
  }

  closeProviderModal() {
    this.showProviderModal.set(false);
    this.selectedProvider.set(null);
  }

  onProviderModalSuccess() {
    this.closeProviderModal();
    this.loadProviders();
  }

  // Métodos para el modal de confirmación de eliminación
  openDeleteProviderModal(provider: HealthcareProvider) {
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
}
