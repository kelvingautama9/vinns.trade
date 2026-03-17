'use client';

import type { ChartDataPoint } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

type GrowthChartProps = {
  data: ChartDataPoint[];
  visibleLines: Record<string, boolean>;
};

const lineColors = {
    nominalValue: 'hsl(var(--chart-1))',
    realValue: 'hsl(var(--chart-2))',
    noInvestment: 'hsl(var(--chart-3))',
    conservative: 'hsl(var(--chart-4))',
    aggressive: 'hsl(var(--chart-5))',
}

const lineNames: Record<string, string> = {
    nominalValue: 'Your Projection (Nominal)',
    realValue: 'Your Projection (Real)',
    noInvestment: 'No Investment',
    conservative: 'Conservative Strategy (6%)',
    aggressive: 'Aggressive Strategy (20%)',
}

export function GrowthChart({ data, visibleLines }: GrowthChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="year"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            label={{ value: "Year", position: "insideBottom", dy: 10, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => {
              if (typeof value !== 'number' || value === 0) return 'Rp 0';
              if (value >= 1e9) return `${(value / 1e9).toFixed(1)} Miliar`;
              if (value >= 1e6) return `${(value / 1e6).toFixed(0)} Juta`;
              if (value >= 1e3) return `${(value / 1e3).toFixed(0)} Ribu`;
              return value.toString();
            }}
          />
          <Tooltip
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
            }}
            formatter={(value, name) => [formatCurrency(value as number, 'IDR'), lineNames[name as string] || name]}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          {Object.entries(visibleLines).map(([key, visible]) => (
            visible && (
                <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={lineNames[key] || key}
                    stroke={lineColors[key as keyof typeof lineColors] || '#8884d8'}
                    strokeWidth={key === 'nominalValue' || key === 'realValue' ? 2.5 : 2}
                    dot={false}
                    strokeDasharray={key !== 'nominalValue' && key !== 'realValue' ? "5 5" : "0"}
                />
            )
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
