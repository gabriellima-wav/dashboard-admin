import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">🎯 Dashboard</h1>

      <!-- Cards de Métricas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Vendas Totais</h3>
          <p class="text-2xl font-bold text-blue-600">R$ 245.830</p>
          <p class="text-sm text-green-600">↗ +12.5% vs mês anterior</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Total de Usuários</h3>
          <p class="text-2xl font-bold text-green-600">8.549</p>
          <p class="text-sm text-red-600">↘ -2.3% vs semana anterior</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Taxa de Conversão</h3>
          <p class="text-2xl font-bold text-purple-600">3.24%</p>
          <p class="text-sm text-green-600">↗ +5.1% vs mês anterior</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Receita Mensal</h3>
          <p class="text-2xl font-bold text-yellow-600">R$ 89.420</p>
          <p class="text-sm text-green-600">↗ +8.7% vs mês anterior</p>
        </div>
      </div>

      <!-- Tabela Simples -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">João Silva</td>
                <td class="px-6 py-4 text-sm text-gray-900">Carteira Premium</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">R$ 299,90</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Concluído
                  </span>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Maria Santos</td>
                <td class="px-6 py-4 text-sm text-gray-900">Bolsa Executiva</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">R$ 450,00</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pendente
                  </span>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Pedro Costa</td>
                <td class="px-6 py-4 text-sm text-gray-900">Cinto Social</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">R$ 120,00</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Cancelado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  // ← Certifique-se de que a exportação está correta
}
