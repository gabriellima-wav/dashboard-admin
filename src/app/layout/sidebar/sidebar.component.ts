import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true, // ← Garantir que está marcado como standalone
  imports: [CommonModule, RouterModule],
  template: `
    <div [class]="getSidebarClasses()">
      <!-- Logo -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ isCollapsed() ? 'DP' : 'Dashboard Pro' }}
        </h2>
      </div>

      <!-- Menu Items -->
      <nav class="mt-6 px-3">
        <ul class="space-y-2">
          <li *ngFor="let item of menuItems()">
            <a [routerLink]="item.route"
               [class]="getMenuItemClasses(item)"
               (click)="setActiveItem(item)"
               [title]="item.label">
              <span class="text-xl mr-3">{{ item.icon }}</span>
              <span *ngIf="!isCollapsed()">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Toggle Button -->
      <div class="absolute bottom-4 left-4">
        <button
          (click)="toggleSidebar()"
          class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors">
          <span class="text-lg">{{ isCollapsed() ? '→' : '←' }}</span>
        </button>
      </div>
    </div>
  `
})
export class SidebarComponent {
  @Output() sidebarToggled = new EventEmitter<boolean>();

  isCollapsed = signal(false);

  menuItems = signal<MenuItem[]>([
    { label: 'Dashboard', icon: '📊', route: '/dashboard', active: true },
    { label: 'Analytics', icon: '📈', route: '/analytics', active: false },
    { label: 'Usuários', icon: '👥', route: '/users', active: false },
    { label: 'Produtos', icon: '📦', route: '/products', active: false },
    { label: 'Configurações', icon: '⚙️', route: '/settings', active: false }
  ]);

  getSidebarClasses(): string {
    return `fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
      this.isCollapsed() ? 'w-16' : 'w-64'
    }`;
  }

  getMenuItemClasses(item: MenuItem): string {
    const baseClasses = 'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 w-full';
    const activeClasses = 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300';
    const inactiveClasses = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700';

    return `${baseClasses} ${item.active ? activeClasses : inactiveClasses}`;
  }

  setActiveItem(selectedItem: MenuItem) {
    const items = this.menuItems();
    items.forEach(item => item.active = item === selectedItem);
    this.menuItems.set([...items]);
  }

  toggleSidebar() {
    const newState = !this.isCollapsed();
    this.isCollapsed.set(newState);
    this.sidebarToggled.emit(newState);
  }
}
