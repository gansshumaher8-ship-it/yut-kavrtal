'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const data = [
  { stage: 'Покупка', label: 'Покупка', value: 100 },
  { stage: 'Ремонт', label: 'Ремонт и меблировка', value: 125 },
  { stage: 'Сдача', label: 'Сдача в аренду', value: 135 },
  { stage: 'Стабилизация', label: 'Стабильный денежный поток', value: 145 }
];

export function GrowthChart() {
  return (
    <section className="card p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Рост стоимости проекта
          </h2>
          <p className="text-xs text-slate-800">
            От покупки до стабилизации аренды
          </p>
        </div>
        <span className="text-xs rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-800">
          Индекс к моменту покупки = 100
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -30, right: 10, top: 10 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ea580c" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f8fafc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="stage"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                fontSize: 12,
                color: '#334155'
              }}
              formatter={(value: number) => [`${value}`, 'Индекс стоимости']}
              labelFormatter={(label) =>
                data.find((d) => d.stage === label)?.label ?? label
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ea580c"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
