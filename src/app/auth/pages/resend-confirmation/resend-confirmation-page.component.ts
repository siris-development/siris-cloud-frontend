import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resend-confirmation-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './resend-confirmation-page.component.html',
  styleUrls: ['./resend-confirmation-page.component.css']
})
export class ResendConfirmationPageComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  errorHandler = inject(ErrorHandlerService);
  
  loading = signal(false);
  emailSent = signal(false);
  hasError = signal(false);

  resendConfirmationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get email() {
    return this.resendConfirmationForm.get('email');
  }

  async resendConfirmation(): Promise<void> {
    if (this.resendConfirmationForm.invalid) {
      this.errorHandler.showError('Por favor, ingresa un email válido.');
      return;
    }

    this.loading.set(true);

    const { email = '' } = this.resendConfirmationForm.value;
    
    this.authService.resendConfirmation(email!)
      .subscribe({
        next: (response) => {
          this.emailSent.set(true);
          this.loading.set(false);
          this.errorHandler.showSuccess('¡Código de confirmación reenviado! Revisa tu correo electrónico.');
        },
        error: (error) => {
          this.loading.set(false);
          // El error ya se maneja en el interceptor y AuthService
        }
      });
  }

  async handleMissingEmail(): Promise<void> {
    if (this.resendConfirmationForm.invalid) {
      this.errorHandler.showError('Por favor, ingresa un email válido.');
      return;
    }

    this.loading.set(true);

    const { email = '' } = this.resendConfirmationForm.value;
    
    this.authService.handleMissingEmail(email!, 'resend_confirmation')
      .subscribe({
        next: (response) => {
          this.emailSent.set(true);
          this.loading.set(false);
          this.errorHandler.showSuccess('¡Código de confirmación reenviado! Revisa tu correo electrónico.');
        },
        error: (error) => {
          this.loading.set(false);
          // El error ya se maneja en el interceptor y AuthService
        }
      });
  }
}
