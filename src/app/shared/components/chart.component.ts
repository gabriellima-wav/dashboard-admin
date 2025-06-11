import { Component, Input, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartData } from '../../core/models/dashboard.model';


@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ title }}
      </h3>
      <apx-chart
        [series]="chartOptions.series"
        [chart]="chartOptions.chart"
        [xaxis]="chartOptions.xaxis"
        [colors]="chartOptions.colors"
        [dataLabels]="chartOptions.dataLabels"
        [grid]="chartOptions.grid"
        [stroke]="chartOptions.stroke"
        [fill]="chartOptions.fill"
      >
      </apx-chart>
    </div>
  `,
})
export class ChartComponent implements OnInit {
  @Input() data!: ChartData;
  @Input() title: string = '';
  @Input() height: number = 350;

  chartOptions: any = {};

  ngOnInit() {
    this.setupChart();
  }

  private setupChart() {
    this.chartOptions = {
      series: this.data.series,
      chart: {
        type: this.data.type,
        height: this.height,
        background: 'transparent',
        toolbar: { show: false },
      },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 5,
      },
      xaxis: {
        categories: this.data.categories,
        labels: {
          style: { colors: '#6b7280' },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          opacityFrom: 0.8,
          opacityTo: 0.1,
        },
      },
    };
  }
}
