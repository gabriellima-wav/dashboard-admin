import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FiltersComponent } from '../filters/filters.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { DashboardService, FilterOptions, PaginatedResponse } from '../../../core/services/dashboard.service';
import { TableData } from '../../../core/models/dashboard.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FiltersComponent, PaginationComponent],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Pedidos Recentes
          </h3>
          <div class="flex space-x-2">
            <button class="px-3 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
              <lucide-icon name="plus" [size]="16" class="inline mr-1"></lucide-icon>
              Novo Pedido
            </button>
            <button class="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <lucide-icon name="download" [size]="16" class="inline mr-1"></lucide-icon>
              Exportar
            </button>
          </div>
        </div>
      </div>

      <!-- Ações em Lote (aparece quando há itens selecionados) -->
      <div *ngIf="selectedItems().size > 0"
           class="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div class="flex items-center justify-between">
          <span class="text-sm text-blue-700 dark:text-blue-300">
            {{ selectedItems().size }} item(ns) selecionado(s)
          </span>
          <div class="flex space-x-2">
            <button
              (click)="performBulkAction('export')"
              class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors">
              <lucide-icon name="download" [size]="14" class="inline mr-1"></lucide-icon>
              Exportar
            </button>
            <button
              (click)="performBulkAction('archive')"
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <lucide-icon name="archive" [size]="14" class="inline mr-1"></lucide-icon>
              Arquivar
            </button>
            <button
              (click)="performBulkAction('delete')"
              class="px-3 py-1 text-sm bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors">
              <lucide-icon name="trash-2" [size]="14" class="inline mr-1"></lucide-icon>
              Excluir
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <app-filters (filtersChange)="onFiltersChange($event)"></app-filters>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <!-- Table -->
      <div *ngIf="!loading()" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <input type="checkbox"
                       [checked]="isAllSelected()"
                       (change)="toggleSelectAll($event)"
                       class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
              </th>
              <th *ngFor="let column of columns"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  (click)="sortBy(column.key)">
                <div class="flex items-center space-x-1">
                  <span>{{ column.label }}</span>
                  <lucide-icon
                    *ngIf="sortColumn() === column.key"
                    [name]="sortDirection() === 'asc' ? 'chevron-up' : 'chevron-down'"
                    [size]="16">
                  </lucide-icon>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr *ngFor="let item of paginatedData().data; trackBy: trackByFn"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                [class.bg-blue-50]="selectedItems().has(item.id)"
                [class.dark:bg-blue-900]="selectedItems().has(item.id)">

              <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox"
                       [checked]="selectedItems().has(item.id)"
                       (change)="toggleSelectItem(item.id, $event)"
                       class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ getInitials(item.customer) }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ item.customer }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ item.product }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ item.amount | currency:'BRL':'symbol':'1.2-2' }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span [class]="getStatusClasses(item.status)">
                  {{ getStatusText(item.status) }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ item.date | date:'short' }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button (click)="viewItem(item)"
                          class="text-primary-600 hover:text-primary-900 transition-colors"
                          title="Visualizar">
                    <lucide-icon name="eye" [size]="16"></lucide-icon>
                  </button>
                  <button (click)="editItem(item)"
                          class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          title="Editar">
                    <lucide-icon name="edit" [size]="16"></lucide-icon>
                  </button>
                  <button (click)="deleteItem(item)"
                          class="text-red-600 hover:text-red-900 transition-colors"
                          title="Excluir">
                    <lucide-icon name="trash-2" [size]="16"></lucide-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <app-pagination
        [currentPage]="currentPage()"
        [pageSize]="pageSize()"
        [total]="paginatedData().total"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)">
      </app-pagination>
    </div>
  `
})
export class AdvancedTableComponent implements OnInit {
  loading = signal(false);
  paginatedData = signal<PaginatedResponse<TableData>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10
  });

  currentPage = signal(1);
  pageSize = signal(10);
  filters = signal<FilterOptions>({});
  selectedItems = signal<Set<string>>(new Set());
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  columns = [
    { key: 'customer', label: 'Cliente' },
    { key: 'product', label: 'Produto' },
    { key: 'amount', label: 'Valor' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Data' }
  ];

  constructor(
    private dashboardService: DashboardService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.dashboardService.getFilteredOrders(
      this.currentPage(),
      this.pageSize(),
      this.filters()
    ).subscribe(data => {
      this.paginatedData.set(data);
      this.loading.set(false);
    });
  }

  onFiltersChange(filters: FilterOptions) {
    this.filters.set(filters);
    this.currentPage.set(1);
    const activeFilters = [];
    if (filters.searchTerm) activeFilters.push('busca');
    if (filters.status && filters.status !== 'all') activeFilters.push('status');
    if (filters.dateFrom || filters.dateTo) activeFilters.push('período');

    if (activeFilters.length > 0) {
      this.toastService.info(
        'Filtros Aplicados',
        `Filtros ativos: ${activeFilters.join(', ')}`
      );
    }

    this.loadData();
  }

  performBulkAction(action: 'delete' | 'export' | 'archive') {
    const selectedCount = this.selectedItems().size;

    if (selectedCount === 0) {
      this.toastService.warning(
        'Nenhum Item Selecionado',
        'Selecione pelo menos um item para realizar esta ação'
      );
      return;
    }

    switch (action) {
      case 'delete':
        this.toastService.show({
          type: 'warning',
          title: 'Exclusão em Lote',
          message: `Confirmar exclusão de ${selectedCount} item(ns)?`,
          persistent: true,
          action: {
            label: 'Confirmar',
            handler: () => this.bulkDelete()
          }
        });
        break;

      case 'export':
        this.toastService.success(
          'Exportação Iniciada',
          `Exportando ${selectedCount} item(ns)...`
        );
        // Simular exportação
        setTimeout(() => {
          this.toastService.success(
            'Exportação Concluída',
            'Arquivo baixado com sucesso'
          );
        }, 2000);
        break;

      case 'archive':
        this.toastService.info(
          'Arquivamento Iniciado',
          `Arquivando ${selectedCount} item(ns)...`
        );
        // Simular arquivamento
        setTimeout(() => {
          this.toastService.success(
            'Arquivamento Concluído',
            `${selectedCount} item(ns) arquivado(s) com sucesso`
          );
          this.selectedItems.set(new Set());
          this.loadData();
        }, 1500);
        break;
    }
  }

  private bulkDelete() {
    const count = this.selectedItems().size;
    // Simular exclusão em lote
    setTimeout(() => {
      this.toastService.success(
        'Exclusão Concluída',
        `${count} item(ns) excluído(s) com sucesso`
      );
      this.selectedItems.set(new Set());
      this.loadData();
    }, 1500);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadData();
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadData();
  }

  sortBy(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.loadData();
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      const allIds = new Set(this.paginatedData().data.map(item => item.id));
      this.selectedItems.set(allIds);
    } else {
      this.selectedItems.set(new Set());
    }
  }

  toggleSelectItem(id: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentSelection = new Set(this.selectedItems());

    if (isChecked) {
      currentSelection.add(id);
    } else {
      currentSelection.delete(id);
    }

    this.selectedItems.set(currentSelection);
  }

  isAllSelected(): boolean {
    const data = this.paginatedData().data;
    const selected = this.selectedItems();
    return data.length > 0 && data.every(item => selected.has(item.id));
  }

  // Métodos auxiliares
  trackByFn(index: number, item: TableData) {
    return item.id;
  }

  getInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getStatusClasses(status: string): string {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';

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
      'completed': 'Concluído',
      'pending': 'Pendente',
      'cancelled': 'Cancelado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }

  // Ações da tabela
  viewItem(item: TableData) {
    this.toastService.info(
      'Visualizar Item',
      `Abrindo detalhes do pedido de ${item.customer}`
    );
    // Implementar modal de visualização
  }

  editItem(item: TableData) {
    this.toastService.info(
      'Editar Item',
      `Editando pedido de ${item.customer}`
    );
    // Implementar modal de edição
  }

  deleteItem(item: TableData) {
    this.toastService.show({
      type: 'warning',
      title: 'Confirmar Exclusão',
      message: `Deseja realmente excluir o pedido de ${item.customer}?`,
      persistent: true,
      action: {
        label: 'Confirmar Exclusão',
        handler: () => this.confirmDelete(item)
      }
    });
  }

  // Método confirmDelete implementado
  confirmDelete(item: TableData): void {
    // Simular exclusão individual
    setTimeout(() => {
      this.toastService.success(
        'Item Excluído',
        `Pedido de ${item.customer} foi excluído com sucesso`
      );

      // Remover da seleção se estiver selecionado
      const currentSelection = new Set(this.selectedItems());
      currentSelection.delete(item.id);
      this.selectedItems.set(currentSelection);

      // Recarregar dados
      this.loadData();
    }, 1000);
  }
}
