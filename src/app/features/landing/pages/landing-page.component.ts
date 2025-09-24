import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@/features/auth';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  private authService = inject(AuthService);

  // Computed signals para verificar el estado de autenticación
  isAuthenticated = computed(() => this.authService.authStatus());
  user = computed(() => this.authService.user());
  primaryTenant = computed(() => this.authService.primaryTenant());

  constructor() {
    console.log(this.primaryTenant());
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}
