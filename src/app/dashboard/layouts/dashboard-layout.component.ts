import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/auth/auth.service';
import { SidebarComponent } from "@/shared/components/sidebar/sidebar.component";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  currentRoute = '';

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  getCurrentPageTitle(): string {
    const routeMap: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/dashboard/home': 'Inicio',
      '/dashboard/encriptado': 'Encriptado',
      '/dashboard/payment': 'Pagos',
      '/dashboard/whatsapp': 'WhatsApp',
      '/dashboard/agentes-citas': 'Agentes de Citas'
    };
    
    return routeMap[this.currentRoute] || 'Dashboard';
  }

  getCurrentPageDescription(): string {
    const descriptionMap: { [key: string]: string } = {
      '/dashboard': 'Panel principal de control',
      '/dashboard/home': 'Bienvenido a tu panel de control',
      '/dashboard/encriptado': 'Gestión de datos encriptados',
      '/dashboard/payment': 'Administración de pagos y facturación',
      '/dashboard/whatsapp': 'Integración con WhatsApp Business',
      '/dashboard/agentes-citas': 'Gestiona y configura tus agentes de citas automatizados'
    };
    
    return descriptionMap[this.currentRoute] || 'Gestiona tus actividades';
  }
}
