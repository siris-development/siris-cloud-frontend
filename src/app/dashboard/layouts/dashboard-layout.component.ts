import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/auth/auth.service';
import { SidebarComponent } from "@/shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);
}
