import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@/features/auth';
import { TierService, Tier } from '@/features/tiers';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  private authService = inject(AuthService);
  private tierService = inject(TierService);

  // Signals para tiers
  tiers = signal<Tier[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Computed signals para verificar el estado de autenticación
  isAuthenticated = computed(() => this.authService.authStatus());
  user = computed(() => this.authService.user());
  primaryTenant = computed(() => this.authService.primaryTenant());

  async ngOnInit() {
    await this.loadTiers();
  }

  async loadTiers() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const tiers = await firstValueFrom(this.tierService.findActive());
      this.tiers.set(tiers || []);
      
    } catch (err) {
      this.error.set('Error al cargar los planes');
    } finally {
      this.loading.set(false);
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  getUsageLimitText(usageLimit: number): string {
    if (usageLimit === 0) return 'Uso ilimitado';
    return `Hasta ${usageLimit.toLocaleString('es-ES')} unidades`;
  }

  getFeaturesList(features?: Record<string, any>): string[] {
    if (!features) return [];
    
    const featureList: string[] = [];
    
    // Extract common features from the features object
    if (features['users']) {
      featureList.push(`Hasta ${features['users']} usuarios`);
    }
    if (features['storage']) {
      featureList.push(`${features['storage']}GB almacenamiento`);
    }
    if (features['support']) {
      featureList.push(features['support']);
    }
    if (features['sla']) {
      featureList.push(features['sla']);
    }
    if (features['integrations']) {
      featureList.push('Integraciones avanzadas');
    }
    
    // Add any custom features
    if (features['custom']) {
      if (Array.isArray(features['custom'])) {
        featureList.push(...features['custom']);
      } else {
        featureList.push(features['custom']);
      }
    }
    
    return featureList;
  }
}
