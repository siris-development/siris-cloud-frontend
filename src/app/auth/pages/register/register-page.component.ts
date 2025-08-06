import { AuthService } from '@/auth/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  authService = inject(AuthService);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirm_password');
  }

  async register(): Promise<void> {
     if (this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return;
    }

      this.loading.set(true)

      const { email = '', password = '' } = this.registerForm.value;
      this.authService.register(email!, password!)
      .subscribe((isRegistering) => {
        if(isRegistering) {
          this.isRegistering.set(true);
          this.loading.set(false);
        }

        this.hasError.set(true);
        this.loading.set(false);
      });
  }

  passwordMatchValidator(formGroup: any) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
