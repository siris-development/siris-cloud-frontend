import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  imports: [ReactiveFormsModule, RouterLink],
})

export class LoginPageComponent {
  fb = inject(FormBuilder);
  loading = signal(false);
  hasError = signal(false);
  showResendConfirmation = signal(false);
  router = inject(Router);

  authService = inject(AuthService);
  errorHandler = inject(ErrorHandlerService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.errorHandler.showError('Por favor, completa todos los campos correctamente');
      return;
    }

    this.loading.set(true)

    const { email = '', password = '' } = this.loginForm.value;
    this.authService.login(email!, password!)
      .subscribe({
        next: (isAuthenticated) => {
          if (isAuthenticated) {
            this.loading.set(false);
            this.errorHandler.showSuccess('¡Inicio de sesión exitoso!');
            this.router.navigateByUrl('/dashboard');
            return;
          }
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          // Verificar si el error es de email no confirmado
          if (error?.message && error.message.includes('correo electrónico no ha sido confirmado')) {
            this.showResendConfirmation.set(true);
          } else {
            this.showResendConfirmation.set(false);
          }
          // El error ya se maneja en el interceptor y AuthService
        }
      });
  }
}
