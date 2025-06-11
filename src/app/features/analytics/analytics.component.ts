import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChartData } from '../../core/models/dashboard.model';
import { ChartComponent } from '../../shared/components/chart.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  template: `
    <div class="p-6 space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p class="text-gray-600 dark:text-gray-400">Análises detalhadas e relatórios avançados</p>
      </div>

      <!-- Filter Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            *ngFor="let tab of tabs; trackBy: trackByTab"
            (click)="activeTab.set(tab.id)"
            [class]="getTabClasses(tab.id)"
            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors">
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Content Area -->
      <div [ngSwitch]="activeTab()">
        <!-- Vendas Tab -->
        <div *ngSwitchCase="'sales'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <app-chart
              [data]="salesTrendData()"
              title="Tendência de Vendas"
              [height]="300">
            </app-chart>
            <app-chart
              [data]="salesComparisonData()"
              title="Comparação Anual"
              [height]="300">
            </app-chart>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insights de Vendas</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">R$ 124.8K</div>
                <div class="text-sm text-gray-500">Maior faturamento mensal</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">28 dias</div>
                <div class="text-sm text-gray-500">Ciclo médio de vendas</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">73%</div>
                <div class="text-sm text-gray-500">Taxa de retenção</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Produtos Tab -->
        <div *ngSwitchCase="'products'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <app-chart
              [data]="topProductsData()"
              title="Produtos Mais Vendidos"
              [height]="300">
            </app-chart>
            <app-chart
              [data]="productCategoriesData()"
              title="Performance por Categoria"
              [height]="300">
            </app-chart>
          </div>
        </div>

        <!-- Clientes Tab -->
        <div *ngSwitchCase="'customers'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <app-chart
              [data]="customerSegmentData()"
              title="Segmentação de Clientes"
              [height]="300">
            </app-chart>
            <app-chart
              [data]="customerRetentionData()"
              title="Taxa de Retenção"
              [height]="300">
            </app-chart>
          </div>
        </div>

        <!-- Tráfego Tab -->
        <div *ngSwitchCase="'traffic'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <app-chart
              [data]="trafficSourceData()"
              title="Fontes de Tráfego"
              [height]="300">
            </app-chart>
            <app-chart
              [data]="conversionFunnelData()"
              title="Funil de Conversão"
              [height]="300">
            </app-chart>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  activeTab = signal('sales');

  tabs = [
    { id: 'sales', label: 'Vendas' },
    { id: 'products', label: 'Produtos' },
    { id: 'customers', label: 'Clientes' },
    { id: 'traffic', label: 'Tráfego' }
  ];

  // Chart data signals
  salesTrendData = signal<ChartData>({ series: [], type: 'area' });
  salesComparisonData = signal<ChartData>({ series: [], type: 'bar' });
  topProductsData = signal<ChartData>({ series: [], type: 'bar' });
  productCategoriesData = signal<ChartData>({ series: [], type: 'donut' });
  customerSegmentData = signal<ChartData>({ series: [], type: 'donut' });
  customerRetentionData = signal<ChartData>({ series: [], type: 'area' });
  trafficSourceData = signal<ChartData>({ series: [], type: 'donut' });
  conversionFunnelData = signal<ChartData>({ series: [], type: 'bar' });

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadAnalyticsData();
  }

  private loadAnalyticsData() {
    // Simular dados de analytics
    this.salesTrendData.set({
      type: 'area',
      series: [{
        name: 'Vendas 2024',
        data: [45, 52, 38, 71, 65, 94, 87, 103, 89, 125, 140, 158]
      }],
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    });

    this.salesComparisonData.set({
      type: 'bar',
      series: [
        { name: '2023', data: [35, 41, 28, 51, 42, 85, 77] },
        { name: '2024', data: [45, 52, 38, 71, 65, 94, 87] }
      ],
      categories: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7']
    });

    this.productCategoriesData.set({
      type: 'donut',
      series: [35, 25, 20, 15, 5],
      categories: ['Carteiras', 'Bolsas', 'Cintos', 'Mochilas', 'Outros']
    });
  }

  trackByTab(index: number, tab: any) {
    return tab.id;
  }

  getTabClasses(tabId: string): string {
    const isActive = this.activeTab() === tabId;
    return isActive
      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300';
  }
}
