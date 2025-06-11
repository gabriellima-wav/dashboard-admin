import { Injectable, signal } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<ToastMessage[]>([]);
  private toastSubject = new Subject<ToastMessage>();

  toasts$ = this.toastSubject.asObservable();

  getToasts() {
    return this.toasts();
  }

  show(toast: Omit<ToastMessage, 'id'>): string {
    const id = this.generateId();
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      persistent: false,
      ...toast
    };

    this.toasts.update(current => [...current, newToast]);
    this.toastSubject.next(newToast);

    // Auto-remove toast if not persistent
    if (!newToast.persistent && newToast.duration) {
      timer(newToast.duration).subscribe(() => {
        this.remove(id);
      });
    }

    return id;
  }

  success(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  error(title: string, message: string, persistent = true): string {
    return this.show({
      type: 'error',
      title,
      message,
      persistent,
      duration: persistent ? undefined : 7000
    });
  }

  warning(title: string, message: string, duration = 6000): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  info(title: string, message: string, duration = 5000): string {
    return this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  remove(id: string): void {
    this.toasts.update(current => current.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
