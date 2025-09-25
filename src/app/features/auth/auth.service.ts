import { computed, inject, Injectable, signal } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment'
import { User } from './interfaces/user.interface';
import { Tenant, PrimaryTenant } from './interfaces/tenant.interface';
import { 
  LoginResponse, 
  RegisterResponse, 
  UserProfileResponse, 
  CheckUserStatusResponse,
  JoinTenantResponse,
  MessageResponse 
} from './interfaces/supabase-auth-response.interface';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { LOCAL_STORAGE_KEYS, StorageUtils } from '../../core/config/storage.config';
import { Router } from '@angular/router';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN));
  private _currentTenant = signal<Tenant | null>(null);
  private _tenants = signal<Tenant[]>([]);
  private _primaryTenant = signal<PrimaryTenant | null>(null);

  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);
  constructor() {
    // Limpiar datos antiguos de localStorage al inicializar
    StorageUtils.cleanLegacyData();
    
    // Restaurar datos del usuario desde localStorage
    this.restoreUserDataFromStorage();
  }

  // checkStatusResource = rxResource({
  //   loader: () => this.checkStatus()
  // })

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if ( this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());
  currentTenant = computed(() => this._currentTenant());
  tenants = computed(() => this._tenants());
  primaryTenant = computed(() => this._primaryTenant());

  private getHeaders(): HttpHeaders {
    const token = this._token();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // 1. Registro de Usuario
  register(email: string, password: string, tenantName: string, tenantIdentifier: string) {
    return this.http.post<RegisterResponse>(`${environment.baseUrl}/auth/register`, {
      email,
      password,
      tenantName,
      tenantIdentifier
    }).pipe(
      map(resp => this.handleRegisterSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  // 2. Inicio de Sesión
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.baseUrl}/auth/login`, { email, password })
    .pipe(
      map(resp => this.handleLoginSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  // 3. Obtener Perfil de Usuario
  getProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${environment.baseUrl}/auth/me`, {
      headers: this.getHeaders()
    }).pipe(
      tap(resp => this.handleProfileSuccess(resp)),
      catchError((error: any) => {
        this.handleAuthError(error);
        throw error; // Re-lanzar el error para que el Observable falle correctamente
      })
    );
  }

  // 4. Restablecer Contraseña
  resetPassword(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${environment.baseUrl}/auth/reset-password`, { email })
    .pipe(
      catchError((error: any) => {
        this.handleAuthError(error);
        throw error;
      })
    );
  }

  // 5. Reenviar Confirmación
  resendConfirmation(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${environment.baseUrl}/auth/resend-confirmation`, { email })
    .pipe(
      catchError((error: any) => {
        this.handleAuthError(error);
        throw error;
      })
    );
  }

  // 6. Verificar Estado de Usuario
  checkUserStatus(email: string, tenantIdentifier: string): Observable<CheckUserStatusResponse> {
    return this.http.post<CheckUserStatusResponse>(`${environment.baseUrl}/auth/check-user-status`, {
      email,
      tenantIdentifier
    }).pipe(
      catchError((error: any) => {
        this.handleAuthError(error);
        throw error;
      })
    );
  }

  // 7. Unirse a Tenant
  joinTenant(email: string, tenantIdentifier: string, role: 'admin' | 'user' = 'user'): Observable<JoinTenantResponse> {
    return this.http.post<JoinTenantResponse>(`${environment.baseUrl}/auth/join-tenant`, {
      email,
      tenantIdentifier,
      role
    }).pipe(
      catchError((error: any) => {
        this.handleAuthError(error);
        throw error;
      })
    );
  }

  // 8. Manejar Correos Perdidos
  handleMissingEmail(email: string, action: 'resend_confirmation' | 'resend_password_reset' | 'check_status'): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${environment.baseUrl}/auth/handle-missing-email`, {
      email,
      action
    }).pipe(
      catchError((error: any) => {
        this.handleAuthError(error);
        throw error;
      })
    );
  }

  // 9. Recuperación Inteligente de Cuenta
  recoverAccount(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${environment.baseUrl}/auth/recover-account`, { email })
    .pipe(
      catchError((error: any) => {
        this.handleAuthError(error);
        throw error;
      })
    );
  }

  // 10. Verificar Estado de Autenticación
  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.getProfile().pipe(
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  // 11. Seleccionar Tenant
  selectTenant(tenant: Tenant) {
    this._currentTenant.set(tenant);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_TENANT, JSON.stringify(tenant));
  }

  // 12. Cerrar Sesión
  logout() {
    this._user.set(null);
    this._token.set(null);
    this._currentTenant.set(null);
    this._tenants.set([]);
    this._primaryTenant.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_TENANT);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);

    this.router.navigateByUrl('/'); // Redirigir al login
  }

  // Método para restaurar datos del usuario desde localStorage
  private restoreUserDataFromStorage(): void {
    try {
      // Restaurar token
      const savedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      if (savedToken) {
        this._token.set(savedToken);
      }

      // Restaurar datos del usuario
      const savedUserData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
      if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        this._user.set(userData);
        this._authStatus.set('authenticated');
        
        // Restaurar tenants y primary tenant desde los datos del usuario
        if (userData.tenants) {
          this._tenants.set(userData.tenants);
        }
        if (userData.primaryTenant) {
          this._primaryTenant.set(userData.primaryTenant);
        }
      }

      // Restaurar tenant actual
      const savedCurrentTenant = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_TENANT);
      if (savedCurrentTenant) {
        const tenant = JSON.parse(savedCurrentTenant);
        this._currentTenant.set(tenant);
      }

      // Si tenemos token pero no datos del usuario, intentar obtener el perfil
      if (savedToken && !savedUserData) {
        this.getProfile().subscribe({
          next: () => {
            console.log('Perfil del usuario restaurado desde el servidor');
          },
          error: (error) => {
            console.error('Error al restaurar perfil del usuario:', error);
            // Si hay error, limpiar la sesión
            this.logout();
          }
        });
      }
    } catch (error) {
      console.error('Error al restaurar datos del usuario desde localStorage:', error);
      // Si hay error al parsear, limpiar localStorage
      this.logout();
    }
  }

  // Métodos privados para manejar respuestas
  private handleRegisterSuccess({ user, session, tenant, primaryTenant, }: RegisterResponse) {

    this._user.set(user);
    this._token.set(session.access_token);
    this._currentTenant.set(tenant);
    this._primaryTenant.set(primaryTenant);
    this._authStatus.set('authenticated');

    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, session.access_token);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_TENANT, JSON.stringify(tenant));
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(user));

    return true;
  }

  private handleLoginSuccess({ user, session, tenants, primaryTenant }: LoginResponse) {
    this._user.set(user);
    this._token.set(session.access_token);
    this._tenants.set(tenants);
    this._primaryTenant.set(primaryTenant);
    this._authStatus.set('authenticated');

    // Si hay tenants, seleccionar el primero por defecto
    if (tenants.length > 0) {
      this.selectTenant(tenants[0]);
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, session.access_token);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(user));

    return true;
  }

  private handleProfileSuccess(profile: UserProfileResponse) {
    this._user.set(profile);
    this._tenants.set(profile.tenants);
    this._primaryTenant.set(profile.primaryTenant || null);
    this._authStatus.set('authenticated');

    // Restaurar tenant seleccionado si existe
    const savedTenant = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_TENANT);
    if (savedTenant) {
      const tenant = JSON.parse(savedTenant);
      const currentTenant = profile.tenants.find(t => t.id === tenant.id);
      if (currentTenant) {
        this._currentTenant.set(currentTenant);
      }
    } else if (profile.primaryTenant) {
      // Si no hay tenant seleccionado, usar el primary tenant
      this._currentTenant.set(profile.primaryTenant);
    }

    // Actualizar datos del usuario en localStorage
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(profile));
  }

  private handleAuthError(error: any) {
    console.error('Auth error:', error);
    this.errorHandler.showApiError(error);
    return of(false);
  }
}
