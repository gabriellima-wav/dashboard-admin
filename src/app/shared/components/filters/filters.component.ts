import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FilterOptions } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div class="flex flex-col lg:flex-row gap-4 items-end">
        <!-- Search Input -->
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buscar
          </label>
          <div class="relative">
            <lucide-icon
              name="search"
              [size]="20"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            </lucide-icon>
            <input
              type="text"
              [(ngModel)]="filters.searchTerm"
              (ngModelChange)="onFilterChange()"
              placeholder="Cliente ou produto..."
              class="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>
        </div>

        <!-- Status Filter -->
        <div class="w-full lg:w-48">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            [(ngModel)]="filters.status"
            (ngModelChange)="onFilterChange()"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="all">Todos</option>
            <option value="completed">Concluído</option>
            <option value="pending">Pendente</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <!-- Date Range -->
        <div class="flex gap-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              [(ngModel)]="dateFromStr"
              (ngModelChange)="onDateFromChange($event)"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Final
            </label>
            <input
              type="date"
              [(ngModel)]="dateToStr"
              (ngModelChange)="onDateToChange($event)"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>
        </div>

        <!-- Clear Filters Button -->
        <button
          (click)="clearFilters()"
          class="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors flex items-center space-x-2">
          <lucide-icon name="x" [size]="16"></lucide-icon>
          <span>Limpar</span>
        </button>
      </div>
    </div>
  `
})
export class FiltersComponent {
  @Output() filtersChange = new EventEmitter<FilterOptions>();

  filters: FilterOptions = {
    searchTerm: '',
    status: 'all'
  };

  dateFromStr = '';
  dateToStr = '';

  onFilterChange() {
    this.filtersChange.emit({ ...this.filters });
  }

  onDateFromChange(dateStr: string) {
    this.dateFromStr = dateStr;
    this.filters.dateFrom = dateStr ? new Date(dateStr) : undefined;
    this.onFilterChange();
  }

  onDateToChange(dateStr: string) {
    this.dateToStr = dateStr;
    this.filters.dateTo = dateStr ? new Date(dateStr) : undefined;
    this.onFilterChange();
  }

  clearFilters() {
    this.filters = {
      searchTerm: '',
      status: 'all'
    };
    this.dateFromStr = '';
    this.dateToStr = '';
    this.onFilterChange();
  }
}
