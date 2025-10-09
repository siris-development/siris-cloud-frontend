import { ErrorHandlerService } from '@/shared/services/error-handler.service';
import { Component, inject, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-two-factor-confirmation-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './two-factor-confirmation-page.component.html',
})
export class TwoFactorConfirmationPageComponent {
  private route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  
  hasError = signal(false);
  loading = signal(false);
  isRegistering = signal(false);
  showResendConfirmation = signal(false);
  
  error: string | null = null;
  errorCode: string | null = null;
  errorDescription: string | null = null;

  authService = inject(AuthService);
  errorHandler = inject(ErrorHandlerService);

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      this.error = params.get('error');
      this.errorCode = params.get('error_code');
      this.errorDescription = params.get('error_description');
      
      // Pre-fill email from query params if available
      const email = params.get('email');
      if (email) {
        this.twoFactorConfirmation.patchValue({ email });
      }
    });
  }
  
  twoFactorConfirmation = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    tenantName: ['', [Validators.required]],
    tenantIdentifier: ['', [Validators.required]],
  });
  

  get email() {
    return this.twoFactorConfirmation.get('email');
  }


  get tenantName() {
    return this.twoFactorConfirmation.get('tenantName');
  }

  get tenantIdentifier() {
    return this.twoFactorConfirmation.get('tenantIdentifier');
  }

  async verifyTwoFactorRegistration(): Promise<void> {
    if (this.twoFactorConfirmation.invalid) {
      this.errorHandler.showError('Por favor, completa todos los campos correctamente');
      return;
    }

    this.loading.set(true);

    const { email = '', tenantName = '' } = this.twoFactorConfirmation.value;

    this.authService.verifyTwoFactorRegistration(email!, tenantName!)
    .subscribe({
      next: (isVerified) => {
        if (isVerified) { 
          this.isRegistering.set(false);
        this.loading.set(false);
          this.errorHandler.showSuccess('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
        }
      }
    });
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
