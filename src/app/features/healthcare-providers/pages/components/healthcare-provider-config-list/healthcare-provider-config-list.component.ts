import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthcareProviderService } from '../../../../../services/healthcare-provider.service';
import { AuthService } from '@/features';
import { ErrorHandlerService } from '../../../../../shared/services/error-handler.service';
import { ProviderAutocompleteComponent } from '../provider-autocomplete/provider-autocomplete.component';

import {
  HealthcareProvider,

  ExternalIpsDataComponent
} from '@/features';

@Component({
  selector: 'app-healthcare-provider-config-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProviderAutocompleteComponent, ExternalIpsDataComponent],
  templateUrl: './healthcare-provider-config-list.component.html',
  styleUrls: ['./healthcare-provider-config-list.component.css']
})
export class HealthcareProviderConfigListComponent implements OnInit {
  private healthcareProviderService = inject(HealthcareProviderService);
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlerService);

  // Estado del componente
  providers = signal<HealthcareProvider[]>([]);
  loading = signal<boolean>(false);
  selectedProviderId = signal<string>('');

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

  onProviderChange(providerId: string) {
    this.selectedProviderId.set(providerId);
  }

  getProviderName(providerId: string): string {
    const provider = this.providers().find(p => p.id === providerId);
    return provider?.name || provider?.identifier || 'Proveedor desconocido';
  }

  onExternalIpsDataLoaded(success: boolean) {
    if (success) {
      console.log('External IPs data loaded successfully');
    } else {
      console.log('Failed to load External IPs data');
    }
  }
}
