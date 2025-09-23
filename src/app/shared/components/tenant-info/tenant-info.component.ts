import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-tenant-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Información del Tenant</h3>
        <div class="flex items-center space-x-2">
          @if (currentTenant()?.isActive) {
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Activo
            </span>
          } @else {
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Inactivo
            </span>
          }
          @if (currentTenant()?.isVerified) {
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Verificado
            </span>
          }
        </div>
      </div>

      @if (currentTenant(); as tenant) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Información Básica -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-3">Información Básica</h4>
            <dl class="space-y-2">
              <div>
                <dt class="text-sm text-gray-500">Nombre</dt>
                <dd class="text-sm font-medium text-gray-900">{{tenant.name}}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Identificador</dt>
                <dd class="text-sm font-medium text-gray-900">{{tenant.identifier}}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Rol</dt>
                <dd class="text-sm font-medium text-gray-900">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        [ngClass]="tenant.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                    {{tenant.role === 'admin' ? 'Administrador' : 'Usuario'}}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Configuración -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-3">Configuración</h4>
            <dl class="space-y-2">
              @if (tenant.billingCurrency) {
                <div>
                  <dt class="text-sm text-gray-500">Moneda</dt>
                  <dd class="text-sm font-medium text-gray-900">{{tenant.billingCurrency}}</dd>
                </div>
              }
              @if (tenant.timeZone) {
                <div>
                  <dt class="text-sm text-gray-500">Zona Horaria</dt>
                  <dd class="text-sm font-medium text-gray-900">{{tenant.timeZone}}</dd>
                </div>
              }
            </dl>
          </div>

          <!-- Límites de Uso -->
          @if (tenant.maxWhatsappAccounts || tenant.maxMonthlyMessages || tenant.maxDailyMessages) {
            <div class="md:col-span-2">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Límites de Uso</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                @if (tenant.maxWhatsappAccounts) {
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">Cuentas WhatsApp</p>
                        <p class="text-2xl font-bold text-green-600">{{tenant.maxWhatsappAccounts}}</p>
                      </div>
                    </div>
                  </div>
                }
                @if (tenant.maxMonthlyMessages) {
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">Mensajes/Mes</p>
                        <p class="text-2xl font-bold text-blue-600">{{tenant.maxMonthlyMessages | number}}</p>
                      </div>
                    </div>
                  </div>
                }
                @if (tenant.maxDailyMessages) {
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">Mensajes/Día</p>
                        <p class="text-2xl font-bold text-orange-600">{{tenant.maxDailyMessages | number}}</p>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Metadatos -->
          @if (tenant.metadata) {
            <div class="md:col-span-2">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Información Adicional</h4>
              <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @if (tenant.metadata.industry) {
                  <div>
                    <dt class="text-sm text-gray-500">Industria</dt>
                    <dd class="text-sm font-medium text-gray-900">{{tenant.metadata.industry}}</dd>
                  </div>
                }
                @if (tenant.metadata.size) {
                  <div>
                    <dt class="text-sm text-gray-500">Tamaño</dt>
                    <dd class="text-sm font-medium text-gray-900">{{tenant.metadata.size}}</dd>
                  </div>
                }
              </dl>
            </div>
          }

          <!-- Fechas -->
          <div class="md:col-span-2">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Fechas</h4>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-gray-500">Creado</dt>
                <dd class="text-sm font-medium text-gray-900">{{tenant.createdAt | date:'medium'}}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Última actualización</dt>
                <dd class="text-sm font-medium text-gray-900">{{tenant.updatedAt | date:'medium'}}</dd>
              </div>
            </dl>
          </div>
        </div>
      } @else {
        <div class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Sin información de tenant</h3>
          <p class="mt-1 text-sm text-gray-500">No se encontró información del tenant principal.</p>
        </div>
      }
    </div>
  `
})
export class TenantInfoComponent {
  authService = inject(AuthService);
  
  // Computed para obtener el tenant actual (prioriza currentTenant sobre primaryTenant)
  currentTenant = computed(() => {
    return this.authService.currentTenant() || this.authService.primaryTenant();
  });
}

