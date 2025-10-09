
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ErrorHandlerService } from '@/shared/services/error-handler.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-two-factor-registration-page',
  templateUrl: './two-factor-registration-page.component.html',
  imports: [ReactiveFormsModule, RouterLink],
})

export class TwoFactorRegistrationPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  loading = signal(false);
  isRegistering = signal(false);
  showResendConfirmation = signal(false);
  showInstructions = signal(false);
  userEmail = signal('');

  authService = inject(AuthService);
  errorHandler = inject(ErrorHandlerService);
  router = inject(Router);

  twoFactorRegistrationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50), this.passwordStrengthValidator]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  get email() {
    return this.twoFactorRegistrationForm.get('email');
  }

  get password() {
    return this.twoFactorRegistrationForm.get('password');
  }

  get confirmPassword() {
    return this.twoFactorRegistrationForm.get('confirmPassword');
  }

  passwordMatchValidator(formGroup: any) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  passwordStrengthValidator(control: any) {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return { passwordStrength: true };
    }
    return null;
  }

  async twoFactorRegistration(): Promise<void> {
    if (this.twoFactorRegistrationForm.invalid) {
      this.errorHandler.showError('Por favor, completa todos los campos correctamente');
      return;
    }

    this.loading.set(true);

    const { email = '', password = '' } = this.twoFactorRegistrationForm.value;

    this.authService.twoFactorRegistration(email!, password!)
      .subscribe({
        next: (response) => {
          if (response && typeof response === 'object' && 'success' in response) {
            this.isRegistering.set(true);
            this.loading.set(false);
            
            if (response.requiresEmailVerification) {
              this.errorHandler.showSuccess('¡Registro exitoso! Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para completar tu registro.');
              
              // Show instructions instead of redirecting
              this.userEmail.set(email!);
              this.showEmailInstructions();
            }
          } else if (response === true) {
            // Handle legacy response format
            this.isRegistering.set(true);
            this.loading.set(false);
            this.errorHandler.showSuccess('¡Registro exitoso! Hemos enviado un enlace de verificación a tu correo electrónico.');
            this.userEmail.set(email!);
            this.showEmailInstructions();
          }
        },
        error: (error) => {
          this.loading.set(false);
          // Verificar si el error es de email no confirmado o problemas de confirmación
          if (error?.message && (
            error.message.includes('correo electrónico no ha sido confirmado') ||
            error.message.includes('email not confirmed') ||
            error.message.includes('confirmación')
          )) {
            this.showResendConfirmation.set(true);
          } else {
            this.showResendConfirmation.set(false);
          }
          // El error ya se maneja en el interceptor y AuthService
        }
      });
  }

  showEmailInstructions() {
    this.showInstructions.set(true);
  }

  hideInstructions() {
    this.showInstructions.set(false);
    this.isRegistering.set(false);
  }
}
