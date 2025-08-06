import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  imports: [ReactiveFormsModule, RouterLink],
})

export class LoginPageComponent {
  fb = inject(FormBuilder);
  loading = signal(false);
  hasError = signal(false);
  router = inject(Router);

  authService = inject(AuthService);

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
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return;
    }

    this.loading.set(true)

    const { email = '', password = '' } = this.loginForm.value;
    this.authService.login(email!, password!)
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.loading.set(false);
          this.router.navigateByUrl('/');
          return;
        }

        this.hasError.set(true);
        this.loading.set(false);
      });
  }
}
