import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TableData } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Cliente
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Produto
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Valor
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Data
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody
          class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
        >
          <tr
            *ngFor="let item of data(); trackBy: trackByFn"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center"
                >
                  <span
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {{ getInitials(item.customer) }}
                  </span>
                </div>
                <div class="ml-4">
                  <div
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ item.customer }}
                  </div>
                </div>
              </div>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
            >
              {{ item.product }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
            >
              {{ item.amount | currency : 'BRL' : 'symbol' : '1.2-2' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span [class]="getStatusClasses(item.status)">
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
            >
              {{ item.date | date : 'short' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  class="text-primary-600 hover:text-primary-900 transition-colors"
                >
                  <lucide-icon name="eye" [size]="16"></lucide-icon>
                </button>
                <button
                  class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <lucide-icon name="edit" [size]="16"></lucide-icon>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class DataTableComponent {
  @Input() data = signal<TableData[]>([]);

  trackByFn(index: number, item: TableData) {
    return item.id;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getStatusClasses(status: string): string {
    const baseClasses =
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';

    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100`;
    }
  }

  getStatusText(status: string): string {
    const statusMap = {
      completed: 'Concluído',
      pending: 'Pendente',
      cancelled: 'Cancelado',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }
}
