import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(100%)' }),
          stagger(100, animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })))
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full" [@listAnimation]="toasts.length">
      <div
        *ngFor="let toast of toasts; trackBy: trackByFn"
        [@toastAnimation]
        [class]="getToastClasses(toast.type)"
        class="rounded-lg shadow-lg border p-4 backdrop-blur-sm">

        <div class="flex items-start">
          <!-- Icon -->
          <div [class]="getIconClasses(toast.type)" class="flex-shrink-0">
            <lucide-icon [name]="getIcon(toast.type)" [size]="20"></lucide-icon>
          </div>

          <!-- Content -->
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium" [class]="getTitleClasses(toast.type)">
              {{ toast.title }}
            </p>
            <p class="mt-1 text-sm" [class]="getMessageClasses(toast.type)">
              {{ toast.message }}
            </p>

            <!-- Action Button -->
            <div *ngIf="toast.action" class="mt-3">
              <button
                (click)="executeAction(toast)"
                class="text-sm font-medium underline hover:no-underline transition-all"
                [class]="getActionClasses(toast.type)">
                {{ toast.action.label }}
              </button>
            </div>
          </div>

          <!-- Progress Bar for Auto-dismiss -->
          <div *ngIf="!toast.persistent && toast.duration"
               class="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg animate-progress"
               [style.animation-duration]="toast.duration + 'ms'">
          </div>

          <!-- Close Button -->
          <button
            (click)="closeToast(toast.id)"
            class="ml-4 flex-shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 transition-colors"
            [class]="getCloseButtonClasses(toast.type)">
            <lucide-icon name="x" [size]="16"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
    .animate-progress {
      animation: progress linear forwards;
    }
  `]
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private destroy$ = new Subject<void>();

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    // Subscribe to toast updates
    this.toastService.toasts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.toasts = this.toastService.getToasts();
      });

    // Initialize with existing toasts
    this.toasts = this.toastService.getToasts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByFn(index: number, toast: ToastMessage) {
    return toast.id;
  }

  closeToast(id: string) {
    this.toastService.remove(id);
  }

  executeAction(toast: ToastMessage) {
    if (toast.action) {
      toast.action.handler();
      this.closeToast(toast.id);
    }
  }

  getToastClasses(type: string): string {
    const baseClasses = 'relative overflow-hidden';

    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700`;
    }
  }

  getIconClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }

  getTitleClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-gray-800 dark:text-gray-200';
    }
  }

  getMessageClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-700 dark:text-green-300';
      case 'error':
        return 'text-red-700 dark:text-red-300';
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'info':
        return 'text-blue-700 dark:text-blue-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  }

  getActionClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100';
      case 'error':
        return 'text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100';
      case 'info':
        return 'text-blue-800 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-100';
      default:
        return 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100';
    }
  }

  getCloseButtonClasses(type: string): string {
    const baseClasses = 'focus:ring-offset-2';

    switch (type) {
      case 'success':
        return `${baseClasses} text-green-400 hover:text-green-600 focus:ring-green-500 hover:bg-green-100 dark:hover:bg-green-800`;
      case 'error':
        return `${baseClasses} text-red-400 hover:text-red-600 focus:ring-red-500 hover:bg-red-100 dark:hover:bg-red-800`;
      case 'warning':
        return `${baseClasses} text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-800`;
      case 'info':
        return `${baseClasses} text-blue-400 hover:text-blue-600 focus:ring-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800`;
      default:
        return `${baseClasses} text-gray-400 hover:text-gray-600 focus:ring-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700`;
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'x-circle';
      case 'warning':
        return 'alert-triangle';
      case 'info':
        return 'info';
      default:
        return 'bell';
    }
  }
}
