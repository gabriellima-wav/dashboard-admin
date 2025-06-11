import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <!-- Results Info -->
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Mostrando {{ startItem() }} a {{ endItem() }} de {{ total }} resultados
      </div>

      <!-- Pagination Controls -->
      <div class="flex items-center space-x-2">
        <!-- Previous Button -->
        <button
          (click)="previousPage()"
          [disabled]="currentPage <= 1"
          [class]="getButtonClasses(currentPage <= 1)">
          <lucide-icon name="chevron-left" [size]="16"></lucide-icon>
        </button>

        <!-- Page Numbers -->
        <div class="flex space-x-1">
          <button
            *ngFor="let page of visiblePages()"
            (click)="goToPage(page)"
            [class]="getPageButtonClasses(page === currentPage)">
            {{ page }}
          </button>
        </div>

        <!-- Next Button -->
        <button
          (click)="nextPage()"
          [disabled]="currentPage >= totalPages()"
          [class]="getButtonClasses(currentPage >= totalPages())">
          <lucide-icon name="chevron-right" [size]="16"></lucide-icon>
        </button>
      </div>

      <!-- Page Size Selector -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-700 dark:text-gray-300">Por página:</span>
        <select
          [value]="pageSize"
          (change)="onPageSizeChange($event)"
          class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() total = 0;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  totalPages = computed(() => Math.ceil(this.total / this.pageSize));
  startItem = computed(() => (this.currentPage - 1) * this.pageSize + 1);
  endItem = computed(() => Math.min(this.currentPage * this.pageSize, this.total));

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage;
    const delta = 2;

    let range: number[] = [];

    for (let i = Math.max(2, current - delta);
         i <= Math.min(total - 1, current + delta);
         i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift(-1); // Ellipsis
    }
    if (current + delta < total - 1) {
      range.push(-1); // Ellipsis
    }

    range.unshift(1);
    if (total > 1) {
      range.push(total);
    }

    return range.filter((item, index, arr) => arr.indexOf(item) === index);
  });

  previousPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages() && page !== -1) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: Event) {
    const newSize = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(newSize);
  }

  getButtonClasses(disabled: boolean): string {
    return `px-3 py-1 rounded border transition-colors ${
      disabled
        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`;
  }

  getPageButtonClasses(isActive: boolean): string {
    return `px-3 py-1 rounded transition-colors ${
      isActive
        ? 'bg-primary-500 text-white'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`;
  }
}
