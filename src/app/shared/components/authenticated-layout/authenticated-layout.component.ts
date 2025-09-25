import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/features/auth';
import { SidebarComponent } from "@/shared/components/sidebar/sidebar.component";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet],
  templateUrl: './authenticated-layout.component.html',
})
export class AuthenticatedLayoutComponent {
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
      '/dashboard/agentes-citas': 'Agentes de Citas',
      '/external-ips': 'Configuraciones de Bases de Datos Externas',
      '/external-ips/config': 'Configuración',
      '/external-ips/stats': 'Estadísticas',
      '/healthcare-providers': 'Proveedores de Salud',
      '/payment': 'Pagos',
      '/whatsapp': 'WhatsApp'
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
      '/dashboard/agentes-citas': 'Gestiona y configura tus agentes de citas automatizados',
      '/external-ips': 'Gestiona las conexiones a bases de datos externas de diferentes sistemas',
      '/external-ips/config': 'Configuración de conexiones a bases de datos',
      '/external-ips/stats': 'Estadísticas de conexiones y rendimiento',
      '/healthcare-providers': 'Gestión de proveedores de salud',
      '/payment': 'Administración de pagos',
      '/whatsapp': 'Integración con WhatsApp'
    };
    
    return descriptionMap[this.currentRoute] || 'Gestiona tus actividades';
  }
}
