import { rxResource } from '@angular/core/rxjs-interop';
import { computed, inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment'
import { User } from './interfaces/user.interface';
import { SupabaseAuthResponse } from './interfaces/supabase-auth-response.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus()
  })

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if ( this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);

  constructor() {}

  login(email: string, password: string) {
    return this.http.post<SupabaseAuthResponse>(`${environment.baseUrl}/auth/login`, { email, password })
    .pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    )
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

   return this.http.get<SupabaseAuthResponse>(`${environment.baseUrl}/auth/check-status`)
    .pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    )
  }

  register(email: string, password: string) {
    return this.http.post<any>(`${environment.baseUrl}/auth/register`, { email, password }
    ).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  resetPassword(email: string) {
    return this.http.post<any>(`${environment.baseUrl}/auth/register`, { email }
    ).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  private handleAuthSuccess({session, user}: SupabaseAuthResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(session.access_token)

    localStorage.setItem('token', session.access_token);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
