import { AuthService } from '@/auth/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  imports: [ReactiveFormsModule, RouterLink],
})

export class RegisterPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  loading = signal(false);
  isRegistering = signal(false);
  showResendConfirmation = signal(false);

  authService = inject(AuthService);
  errorHandler = inject(ErrorHandlerService);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50), this.passwordStrengthValidator]],
    confirmPassword: ['', [Validators.required]],
    tenantName: ['', [Validators.required, Validators.minLength(3)]],
    tenantIdentifier: ['', [Validators.required, Validators.minLength(3), this.tenantIdentifierValidator]]
  }, { validators: this.passwordMatchValidator });

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get tenantName() {
    return this.registerForm.get('tenantName');
  }

  get tenantIdentifier() {
    return this.registerForm.get('tenantIdentifier');
  }

  async register(): Promise<void> {
    if (this.registerForm.invalid) {
      this.errorHandler.showError('Por favor, completa todos los campos correctamente');
      return;
    }

    this.loading.set(true);

    const { email = '', password = '', tenantName = '', tenantIdentifier = '' } = this.registerForm.value;

    this.authService.register(email!, password!, tenantName!, tenantIdentifier!)
      .subscribe({
        next: (isRegistering) => {
          if (isRegistering) {
            this.isRegistering.set(true);
            this.loading.set(false);
            this.errorHandler.showSuccess('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
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

  tenantIdentifierValidator(control: any) {
    const identifier = control.value;
    if (!identifier) return null;

    // Solo letras, números, guiones y guiones bajos
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(identifier)) {
      return { invalidIdentifier: true };
    }
    return null;
  }
}
