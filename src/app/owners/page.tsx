import { KeyRound, CheckCircle2, FileCheck, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function OwnersPage() {
  return (
    <div className="container-page space-y-10">
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-brand">
          <KeyRound className="h-3 w-3" />
          Для собственников недвижимости
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Сдача вашей квартиры или апартаментов с управляющей компанией «Уютный Квартал»
          </h1>
          <p className="text-lg text-slate-800 max-w-2xl">
            Владеете квартирой или апартаментами в Москве? Передайте управление арендуемой недвижимостью нам — и получайте стабильный доход без хлопот.
          </p>
        </div>
      </section>

      <section className="card p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Почему стоит сдать недвижимость через нас
        </h2>
        <ul className="grid gap-4 md:grid-cols-2 text-sm">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Users className="h-4 w-4" />
            </span>
            <div>
              <p className="font-medium text-slate-800">Собственный поток арендаторов</p>
              <p className="text-slate-800">Всегда актуальная база клиентов, быстрый подбор жильцов.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <p className="font-medium text-slate-800">Всё под ключ</p>
              <p className="text-slate-800">Поиск жильцов, заселение, сопровождение и решение бытовых вопросов — полностью на нас.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <BarChart3 className="h-4 w-4" />
            </span>
            <div>
              <p className="font-medium text-slate-800">Профессиональное управление</p>
              <p className="text-slate-800">Стабильный доход без вашего участия в рутине аренды.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <FileCheck className="h-4 w-4" />
            </span>
            <div>
              <p className="font-medium text-slate-800">Прозрачность и удобство</p>
              <p className="text-slate-800">Понятная отчётность, договорная база, личный кабинет для взаимодействия.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="card p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Как это работает
        </h2>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm">
              1
            </span>
            <div>
              <p className="font-medium text-slate-800">Оставьте заявку</p>
              <p className="text-slate-800">Заполните форму и приложите данные об объекте.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm">
              2
            </span>
            <div>
              <p className="font-medium text-slate-800">Связь и договор</p>
              <p className="text-slate-800">Мы свяжемся с вами, уточним детали и заключим договор.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm">
              3
            </span>
            <div>
              <p className="font-medium text-slate-800">Объект в пуле</p>
              <p className="text-slate-800">Ваш объект попадает в наш внутренний каталог предложений.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm">
              4
            </span>
            <div>
              <p className="font-medium text-slate-800">Доход без рутины</p>
              <p className="text-slate-800">Вы получаете доход, не занимаясь арендой самостоятельно.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="text-center py-8 px-4 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100">
        <p className="text-lg font-medium text-slate-800 mb-4">
          Сдайте квартиру или апартаменты профессионалам и забудьте о рутине.
        </p>
        <Link
          href="#form-rent"
          className="btn-primary inline-flex items-center gap-2"
        >
          Оставить заявку на сдачу в аренду
        </Link>
      </section>

      <section id="form-rent" className="card p-6 md:p-8 max-w-xl mx-auto">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Заявка на сдачу объекта в аренду
        </h2>
        <p className="text-sm text-slate-800 mb-4">
          Оставьте контакты и кратко опишите объект — мы перезвоним и обсудим условия.
        </p>
        <form className="space-y-4 text-sm">
          <label className="block">
            <span className="text-slate-700 block mb-1">Имя</span>
            <input type="text" className="input-field" placeholder="Как к вам обращаться" />
          </label>
          <label className="block">
            <span className="text-slate-700 block mb-1">Телефон</span>
            <input type="tel" className="input-field" placeholder="+7 (___) ___-__-__" />
          </label>
          <label className="block">
            <span className="text-slate-700 block mb-1">Адрес объекта (город, район, улица)</span>
            <input type="text" className="input-field" placeholder="г. Москва, ..." />
          </label>
          <label className="block">
            <span className="text-slate-700 block mb-1">Комментарий</span>
            <textarea rows={3} className="input-field resize-none" placeholder="Тип объекта, площадь, желаемая дата сдачи" />
          </label>
          <button type="submit" className="btn-primary w-full">
            Отправить заявку
          </button>
        </form>
      </section>
    </div>
  );
}
