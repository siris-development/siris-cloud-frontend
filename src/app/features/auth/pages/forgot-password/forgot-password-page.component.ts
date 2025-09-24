
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ErrorHandlerService } from '@/shared/services/error-handler.service';
import { AuthService } from '@/features';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  imports: [ReactiveFormsModule, RouterLink],
})
export class ForgotPasswordPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  loading = signal(false);
  isEmailSent = signal(false);
  errorMessage = signal('');

  authService = inject(AuthService);
  errorHandler = inject(ErrorHandlerService);

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  async sendResetEmail(): Promise<void> {
    if (this.forgotPasswordForm.invalid) {
      this.errorHandler.showError('Por favor, ingresa un email válido.');
      return;
    }

    this.loading.set(true);

    const { email = '' } = this.forgotPasswordForm.value;
    
    this.authService.resetPassword(email!)
      .subscribe({
        next: (response) => {
          this.isEmailSent.set(true);
          this.loading.set(false);
          this.errorHandler.showSuccess('¡Email de recuperación enviado! Revisa tu correo electrónico.');
        },
        error: (error) => {
          this.loading.set(false);
          // El error ya se maneja en el interceptor y AuthService
        }
      });
  }

  async handleMissingEmail(): Promise<void> {
    if (this.forgotPasswordForm.invalid) {
      this.hasError.set(true);
      this.errorMessage.set('Por favor, ingresa un email válido.');
      setTimeout(() => this.hasError.set(false), 3000);
      return;
    }

    this.loading.set(true);

    const { email = '' } = this.forgotPasswordForm.value;
    
    this.authService.handleMissingEmail(email!, 'resend_password_reset')
      .subscribe({
        next: (response) => {
          this.isEmailSent.set(true);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Handle missing email error:', error);
          this.hasError.set(true);
          this.errorMessage.set('Error al procesar la solicitud. Por favor, intenta nuevamente.');
          this.loading.set(false);
          setTimeout(() => this.hasError.set(false), 5000);
        }
      });
  }

  async recoverAccount(): Promise<void> {
    if (this.forgotPasswordForm.invalid) {
      this.hasError.set(true);
      this.errorMessage.set('Por favor, ingresa un email válido.');
      setTimeout(() => this.hasError.set(false), 3000);
      return;
    }

    this.loading.set(true);

    const { email = '' } = this.forgotPasswordForm.value;
    
    this.authService.recoverAccount(email!)
      .subscribe({
        next: (response) => {
          this.isEmailSent.set(true);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Recover account error:', error);
          this.hasError.set(true);
          this.errorMessage.set('Error al procesar la recuperación. Por favor, intenta nuevamente.');
          this.loading.set(false);
          setTimeout(() => this.hasError.set(false), 5000);
        }
      });
  }
}
