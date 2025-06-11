import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map, finalize } from 'rxjs';
import { KPICard, ChartData, TableData } from '../models/dashboard.model';

export interface FilterOptions {
  searchTerm?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getRecentOrders() {
    throw new Error('Method not implemented.');
  }
  getSalesChartData() {
    throw new Error('Method not implemented.');
  }
  getKPIData() {
    throw new Error('Method not implemented.');
  }
  private loading = signal(false);

  // Mock data expandido
  private mockTableData: TableData[] = [
    {
      id: '1',
      customer: 'João Silva',
      product: 'Carteira de Couro Premium',
      amount: 299.90,
      status: 'completed',
      date: new Date('2024-12-15')
    },
    {
      id: '2',
      customer: 'Maria Santos',
      product: 'Bolsa Executiva',
      amount: 450.00,
      status: 'pending',
      date: new Date('2024-12-14')
    },
    {
      id: '3',
      customer: 'Pedro Costa',
      product: 'Cinto Social',
      amount: 120.00,
      status: 'cancelled',
      date: new Date('2024-12-13')
    },
    // ... mais 20 registros mock para demonstrar paginação
    ...Array.from({ length: 20 }, (_, i) => ({
      id: (i + 4).toString(),
      customer: `Cliente ${i + 4}`,
      product: `Produto ${i + 4}`,
      amount: Math.floor(Math.random() * 1000) + 100,
      status: ['completed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'cancelled',
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }))
  ];

  getFilteredOrders(
    page: number = 1,
    pageSize: number = 10,
    filters: FilterOptions = {}
  ): Observable<PaginatedResponse<TableData>> {
    this.loading.set(true);

    return of(this.mockTableData).pipe(
      map(data => {
        // Aplicar filtros
        let filteredData = data;

        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          filteredData = filteredData.filter(item =>
            item.customer.toLowerCase().includes(searchLower) ||
            item.product.toLowerCase().includes(searchLower)
          );
        }

        if (filters.status && filters.status !== 'all') {
          filteredData = filteredData.filter(item => item.status === filters.status);
        }

        if (filters.dateFrom) {
          filteredData = filteredData.filter(item => item.date >= filters.dateFrom!);
        }

        if (filters.dateTo) {
          filteredData = filteredData.filter(item => item.date <= filters.dateTo!);
        }

        // Aplicar paginação
        const startIndex = (page - 1) * pageSize;
        const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

        return {
          data: paginatedData,
          total: filteredData.length,
          page,
          pageSize
        };
      }),
      delay(800),
      finalize(() => this.loading.set(false))
    );
  }

  // Expandir dados do gráfico de categorias
  getCategoriesChartData(): Observable<ChartData> {
    const mockData: ChartData = {
      type: 'donut',
      series: [44, 55, 13, 43, 22],
      categories: ['Carteiras', 'Bolsas', 'Cintos', 'Mochilas', 'Acessórios']
    };

    return of(mockData).pipe(delay(600));
  }
}
