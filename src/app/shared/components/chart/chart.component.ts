import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import ApexCharts from 'apexcharts';
import { ChartData } from '../../../core/models/dashboard.model';

interface SafeChartOptions {
  series: any[];
  chart: {
    type: string;
    height: number;
    background?: string;
    toolbar?: { show: boolean };
    animations?: { enabled: boolean; easing: string; speed: number };
  };
  colors: string[];  // ← Removido undefined
  dataLabels?: { enabled: boolean };
  stroke?: { curve: string; width: number };
  fill?: { type: string; gradient?: any };
  xaxis?: { categories: string[]; labels?: { style: { colors: string } } };
  grid?: { borderColor: string; strokeDashArray: number };
  legend?: { position: string; horizontalAlign: string; labels: { colors: string } };
  labels: string[];  // ← Removido undefined
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 *ngIf="title" class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ title }}
      </h3>

      <div *ngIf="!isLoading; else loadingTemplate">
        <div #chartContainer [style.height.px]="height"></div>
      </div>

      <ng-template #loadingTemplate>
        <div class="flex justify-center items-center" [style.height.px]="height">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </ng-template>
    </div>
  `
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() data!: ChartData;
  @Input() title: string = '';
  @Input() height: number = 350;
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  private chart: ApexCharts | null = null;
  isLoading = true;

  // Propriedades com valores padrão seguros
  chartOptions: SafeChartOptions = {
    series: [],
    chart: {
      type: 'line',
      height: 350,
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 800 }
    },
    colors: ['#3b82f6'], // ← Valor padrão sempre definido
    dataLabels: { enabled: false },
    grid: { borderColor: '#e5e7eb', strokeDashArray: 5 },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      labels: { colors: '#6b7280' }
    },
    labels: [] // ← Valor padrão sempre definido
  };

  ngOnInit() {
    this.initializeChartOptions();
  }

  ngAfterViewInit() {
    if (this.data && this.chartContainer) {
      this.initChart();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  ngOnChanges() {
    if (this.chart && this.data) {
      this.updateChart();
    } else if (this.data && this.chartContainer) {
      this.initChart();
    }
  }

  private initializeChartOptions() {
    if (!this.data) return;

    // Garantir que sempre temos arrays válidos
    const colors = this.data.type === 'donut'
      ? ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      : ['#3b82f6'];

    const labels = this.data.categories || [];

    this.chartOptions = {
      series: this.data.series || [],
      chart: {
        type: this.data.type || 'line',
        height: this.height,
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      colors, // ← Sempre um array válido
      dataLabels: { enabled: false },
      grid: { borderColor: '#e5e7eb', strokeDashArray: 5 },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        labels: { colors: '#6b7280' }
      },
      labels // ← Sempre um array válido
    };

    // Configurações específicas por tipo
    this.applyTypeSpecificConfig();
  }

  private applyTypeSpecificConfig() {
    switch (this.data.type) {
      case 'area':
        this.chartOptions.stroke = { curve: 'smooth', width: 3 };
        this.chartOptions.fill = {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.25,
            opacityFrom: 0.8,
            opacityTo: 0.1
          }
        };
        this.chartOptions.xaxis = {
          categories: this.data.categories || [],
          labels: { style: { colors: '#6b7280' } }
        };
        break;

      case 'donut':
        this.chartOptions.labels = this.data.categories || [];
        break;

      case 'bar':
        this.chartOptions.xaxis = {
          categories: this.data.categories || [],
          labels: { style: { colors: '#6b7280' } }
        };
        break;

      default:
        this.chartOptions.stroke = { curve: 'smooth', width: 3 };
        this.chartOptions.xaxis = {
          categories: this.data.categories || [],
          labels: { style: { colors: '#6b7280' } }
        };
    }
  }

  private async initChart() {
    if (!this.chartContainer || !this.data) return;

    this.isLoading = true;
    this.initializeChartOptions();

    try {
      this.chart = new ApexCharts(this.chartContainer.nativeElement, this.chartOptions);
      await this.chart.render();
      this.isLoading = false;
    } catch (error) {
      console.error('Erro ao renderizar gráfico:', error);
      this.isLoading = false;
    }
  }

  private async updateChart() {
    if (!this.chart) return;

    this.initializeChartOptions();

    try {
      await this.chart.updateOptions(this.chartOptions, true, true);
    } catch (error) {
      console.error('Erro ao atualizar gráfico:', error);
    }
  }
}
