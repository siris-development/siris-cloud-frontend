import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthcareProviderService } from '../../../services/healthcare-provider.service';
import { HealthcareProviderListComponent } from './components/healthcare-provider-list/healthcare-provider-list.component';
import { HealthcareProviderConfigListComponent } from './components/healthcare-provider-config-list/healthcare-provider-config-list.component';

@Component({
  selector: 'app-healthcare-providers',
  standalone: true,
  imports: [CommonModule, HealthcareProviderListComponent, HealthcareProviderConfigListComponent],
  templateUrl: './healthcare-providers-page.component.html',
  styleUrls: ['./healthcare-providers-page.component.css']
})
export class HealthcareProvidersPageComponent {
  private healthcareProviderService = inject(HealthcareProviderService);

  // Estado del tab activo
  activeTab = signal<'providers' | 'configs'>('providers');

  // Métodos para cambiar tabs
  setActiveTab(tab: 'providers' | 'configs') {
    this.activeTab.set(tab);
  }

  // Métodos para obtener el estado del tab
  isProvidersTabActive(): boolean {
    return this.activeTab() === 'providers';
  }

  isConfigsTabActive(): boolean {
    return this.activeTab() === 'configs';
  }
}
