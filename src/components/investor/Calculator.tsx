'use client';

import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Percent, PiggyBank } from 'lucide-react';

const MIN_INVEST = 3_000_000;
const MAX_INVEST = 30_000_000;

export function Calculator() {
  const [amount, setAmount] = useState<number>(10_000_000);

  const {
    rentAnnualProfit,
    rentYield,
    resaleProfit,
    resaleYield,
    repairPeriodMonths
  } = useMemo(() => {
    const repairPeriodMonths = 8;
    const rentYield = 0.15;
    const rentAnnualProfit = amount * rentYield;
    const resaleYield = 0.22;
    const resaleProfit = amount * resaleYield;
    return {
      rentAnnualProfit,
      rentYield: rentYield * 100,
      resaleProfit,
      resaleYield: resaleYield * 100,
      repairPeriodMonths
    };
  }, [amount]);

  return (
    <section className="card p-5 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Калькулятор доходности
          </h2>
          <p className="text-xs text-slate-800">
            Оценка потенциальной доходности при входе в проекты редевелопмента
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs text-brand">
          <Percent className="h-3 w-3" />
          от 15% годовых
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-700">
          <span>Сумма инвестиций</span>
          <span className="font-semibold text-slate-900">
            {amount.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        <Slider
          min={MIN_INVEST}
          max={MAX_INVEST}
          step={250_000}
          value={[amount]}
          onChange={([v]) => setAmount(v)}
        />
        <div className="flex justify-between text-xs text-slate-800">
          <span>{MIN_INVEST.toLocaleString('ru-RU')} ₽</span>
          <span>{MAX_INVEST.toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 text-sm">
        <div className="rounded-2xl border border-slate-200 bg-emerald-50/50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <PiggyBank className="h-4 w-4" />
            </div>
            <div>
              <p className="text-slate-800">Стратегия</p>
              <p className="text-sm font-semibold text-slate-800">Долгосрочная аренда</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-slate-800">Годовой денежный поток</p>
              <p className="text-lg font-semibold text-emerald-600">
                {rentAnnualProfit.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-800">Доходность</p>
              <p className="text-sm font-semibold text-emerald-600">
                ≈ {rentYield.toFixed(1)}% годовых
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-800">
            Доход за счёт аренды после ввода объекта в эксплуатацию.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-amber-50/50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
              <Percent className="h-4 w-4" />
            </div>
            <div>
              <p className="text-slate-800">Стратегия</p>
              <p className="text-sm font-semibold text-slate-800">Выход через перепродажу</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-slate-800">Прибыль при выходе</p>
              <p className="text-lg font-semibold text-amber-700">
                {resaleProfit.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-800">За цикл</p>
              <p className="text-sm font-semibold text-amber-700">
                ≈ {resaleYield.toFixed(1)}% за проект
              </p>
              <p className="text-xs text-slate-800">{repairPeriodMonths} мес.</p>
            </div>
          </div>
          <p className="text-xs text-slate-800">
            Рост стоимости объекта после редевелопмента.
          </p>
        </div>
      </div>
    </section>
  );
}
