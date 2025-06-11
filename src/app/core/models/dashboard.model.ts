export interface KPICard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
  icon: string;
  color: string;
}

export interface ChartData {
  series: any[];
  categories?: string[];
  type: 'area' | 'donut' | 'bar';
}

export interface TableData {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: Date;
}
