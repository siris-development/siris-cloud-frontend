import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService, ErrorMessage } from '../../services/error-handler.service';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
      @for (error of errorHandler.errors(); track error.id) {
        <div 
          class="max-w-4xl w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animate-slide-in-horizontal"
          [ngClass]="getToastClasses(error.type)"
        >
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center flex-1">
                <div class="flex-shrink-0 mr-3">
                  @switch (error.type) {
                    @case ('error') {
                      <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    @case ('warning') {
                      <svg class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    }
                    @case ('success') {
                      <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    @case ('info') {
                      <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  }
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium leading-relaxed" [ngClass]="getTextClasses(error.type)">
                    {{ error.message }}
                  </p>
                  @if (error.type === 'error' && isLongMessage(error.message)) {
                    <div class="mt-1">
                      <button 
                        class="text-xs underline hover:no-underline" 
                        [ngClass]="getTextClasses(error.type)"
                        (click)="toggleExpanded(error.id)"
                      >
                        {{ isExpanded(error.id) ? 'Ver menos' : 'Ver más' }}
                      </button>
                    </div>
                  }
                </div>
              </div>
              <div class="flex-shrink-0 ml-4">
                <button 
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  (click)="errorHandler.removeError(error.id)"
                >
                  <span class="sr-only">Cerrar</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in-horizontal {
      from {
        transform: translateX(-50%) translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }
    
    .animate-slide-in-horizontal {
      animation: slide-in-horizontal 0.4s ease-out;
    }
  `]
})
export class ErrorToastComponent {
  errorHandler = inject(ErrorHandlerService);
  private expandedMessages = new Set<string>();

  getToastClasses(type: ErrorMessage['type']): string {
    switch (type) {
      case 'error':
        return 'border-l-4 border-red-400';
      case 'warning':
        return 'border-l-4 border-yellow-400';
      case 'success':
        return 'border-l-4 border-green-400';
      case 'info':
        return 'border-l-4 border-blue-400';
      default:
        return 'border-l-4 border-gray-400';
    }
  }

  getTextClasses(type: ErrorMessage['type']): string {
    switch (type) {
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'success':
        return 'text-green-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  }

  isLongMessage(message: string): boolean {
    return message.length > 100;
  }

  isExpanded(errorId: string): boolean {
    return this.expandedMessages.has(errorId);
  }

  toggleExpanded(errorId: string): void {
    if (this.expandedMessages.has(errorId)) {
      this.expandedMessages.delete(errorId);
    } else {
      this.expandedMessages.add(errorId);
    }
  }
}
