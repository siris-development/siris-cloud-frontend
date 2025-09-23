import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { dashboardRoutes } from '../../../dashboard/dashboard.routes';
import { AuthService } from '@/auth/auth.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

  authService = inject(AuthService);
  router = inject(Router);
  errorHandler = inject(ErrorHandlerService);

  public menuItems = dashboardRoutes
    .map( route => route.children ?? [])
    .flat()
    .filter( route => route && route.path)
    .filter( route => !route.path?.includes('**'));


  getUserInitials(): string {
    const email = this.authService.user()?.email;
    if (!email) return 'U';
    
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  }

  goToLanding(): void {
    this.router.navigateByUrl('/');
  }

  logout(): void {
    this.authService.logout();
    this.errorHandler.showSuccess('Sesión cerrada correctamente');
    this.router.navigateByUrl('/');
  }
}
