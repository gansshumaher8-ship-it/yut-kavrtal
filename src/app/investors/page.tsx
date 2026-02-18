import { Calculator } from '@/components/investor/Calculator';
import { GrowthChart } from '@/components/investor/GrowthChart';
import { LineChart, ShieldCheck } from 'lucide-react';

export default function InvestorsPage() {
  return (
    <div className="container-page space-y-8">
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-brand">
          <LineChart className="h-3 w-3" />
          Для инвесторов
        </div>
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Инвестиции в редевелопмент: доходность от 15% годовых
          </h1>
          <p className="text-sm text-slate-800 max-w-2xl">
            Мы создаём доходные апартаменты из неэффективных помещений. Вы входите
            на понятном юридическом контуре, а мы ведём объект от подбора до вывода
            на аренду и отчётности.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-sm">
            <p className="text-slate-800">География</p>
            <p className="font-semibold text-slate-800">Москва и Подмосковье</p>
            <p className="text-slate-800">Локации с устойчивым спросом на аренду</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-sm">
            <p className="text-slate-800">Формат участия</p>
            <p className="font-semibold text-slate-800">Лот или доля в проекте</p>
            <p className="text-slate-800">Под ваши цели: доход или рост капитала</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-sm">
            <div className="inline-flex items-center gap-1 text-slate-700">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              Контроль рисков
            </div>
            <p className="text-slate-800">Проверка объекта, прозрачный бюджет, регулярная отчётность</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
        <Calculator />
        <GrowthChart />
      </div>
    </div>
  );
}
