import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <!-- Left Section -->
      <div class="flex items-center space-x-4">
        <button 
          (click)="toggleSidebar.emit()"
          class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors">
          <lucide-icon name="menu" [size]="20"></lucide-icon>
        </button>
        
        <div class="relative hidden md:block">
          <lucide-icon 
            name="search" 
            [size]="20" 
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          </lucide-icon>
          <input 
            type="text" 
            placeholder="Buscar..." 
            class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64">
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-4">
        <!-- Dark Mode Toggle -->
        <button 
          (click)="toggleDarkMode()"
          class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors">
          <lucide-icon [name]="isDarkMode() ? 'sun' : 'moon'" [size]="20"></lucide-icon>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors">
            <lucide-icon name="bell" [size]="20"></lucide-icon>
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </button>
        </div>

        <!-- Profile -->
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">JD</span>
          </div>
          <div class="hidden md:block">
            <p class="text-sm font-medium text-gray-900 dark:text-white">João Silva</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  isDarkMode = signal(false);

  toggleDarkMode() {
    const darkMode = !this.isDarkMode();
    this.isDarkMode.set(darkMode);
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }

  ngOnInit() {
    // Verificar preferência salva
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    }
  }
}
