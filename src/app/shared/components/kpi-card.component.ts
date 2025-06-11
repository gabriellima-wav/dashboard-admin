import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { KPICard } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {{ data.title }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ data.value }}
          </p>
          <div class="flex items-center text-sm">
            <span [class]="getChangeColor()">
              {{ data.change > 0 ? '+' : '' }}{{ data.change }}%
            </span>
            <span class="text-gray-500 dark:text-gray-400 ml-2">
              {{ data.period }}
            </span>
          </div>
        </div>
        <div [class]="getIconClasses()">
          <lucide-icon [name]="data.icon" [size]="24"></lucide-icon>
        </div>
      </div>
    </div>
  `,
})
export class KpiCardComponent {
  @Input() data!: KPICard;

  getChangeColor(): string {
    return this.data.changeType === 'increase'
      ? 'text-green-600 font-semibold'
      : 'text-red-600 font-semibold';
  }

  getIconClasses(): string {
    return `p-3 rounded-lg ${this.data.color} bg-opacity-10 dark:bg-opacity-20`;
  }
}
