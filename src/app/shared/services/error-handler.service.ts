import { Injectable, signal } from '@angular/core';

export interface ErrorMessage {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private _errors = signal<ErrorMessage[]>([]);
  
  errors = this._errors.asReadonly();

  showError(message: string, type: 'error' | 'warning' | 'info' | 'success' = 'error'): void {
    const errorMessage: ErrorMessage = {
      message,
      type,
      timestamp: new Date(),
      id: this.generateId()
    };

    this._errors.update(errors => [...errors, errorMessage]);

    // Auto-remove error after 5 seconds
    setTimeout(() => {
      this.removeError(errorMessage.id);
    }, 5000);
  }

  removeError(id: string): void {
    this._errors.update(errors => errors.filter(error => error.id !== id));
  }

  clearAllErrors(): void {
    this._errors.set([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Métodos específicos para diferentes tipos de errores
  showApiError(error: any): void {
    let message = 'Ha ocurrido un error inesperado';
    
    if (error?.message) {
      message = error.message;
    } else if (error?.error?.message) {
      message = error.error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    this.showError(message, 'error');
  }

  showSuccess(message: string): void {
    this.showError(message, 'success');
  }

  showWarning(message: string): void {
    this.showError(message, 'warning');
  }

  showInfo(message: string): void {
    this.showError(message, 'info');
  }
}
