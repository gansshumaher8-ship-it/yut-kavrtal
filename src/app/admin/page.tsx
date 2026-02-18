'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Loader2, PlusCircle, Trash2, Pencil, User, Link as LinkIcon, Upload, Send, Check, KeyRound, X, Building2 } from 'lucide-react';
import type { Agent } from '@/types/agent';
import type { SiteSettings } from '@/types/site-settings';
import { ProjectImage } from '@/components/ui/ProjectImage';

interface AgentUser {
  id: string;
  login: string;
  role: string;
  name: string;
  agentId?: string;
}

export default function AdminPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [telegramChannelId, setTelegramChannelId] = useState('');
  const [telegramHasToken, setTelegramHasToken] = useState(false);
  const [telegramSaving, setTelegramSaving] = useState(false);
  const [telegramSaved, setTelegramSaved] = useState(false);

  const [agentUsers, setAgentUsers] = useState<AgentUser[]>([]);
  const [creatingForAgentId, setCreatingForAgentId] = useState<string | null>(null);
  const [cabinetLogin, setCabinetLogin] = useState('');
  const [cabinetPassword, setCabinetPassword] = useState('');
  const [cabinetError, setCabinetError] = useState('');
  const [cabinetLoading, setCabinetLoading] = useState(false);
  const [changingPasswordId, setChangingPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [siteSaving, setSiteSaving] = useState(false);
  const [siteSaved, setSiteSaved] = useState(false);

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.json())
      .then(setAgents)
      .catch(() => setAgents([]));
  }, []);

  useEffect(() => {
    fetch('/api/settings/telegram')
      .then((r) => r.json())
      .then((data) => {
        setTelegramChannelId(data.telegramChannelId || '');
        setTelegramHasToken(!!data.hasToken);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setAgentUsers)
      .catch(() => setAgentUsers([]));
  }, []);

  useEffect(() => {
    fetch('/api/settings/site')
      .then((r) => r.json())
      .then(setSiteSettings)
      .catch(() => setSiteSettings(null));
  }, []);

  async function handlePhotoUpload(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Ошибка загрузки фото');
    }
    const { url } = await res.json();
    return url;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const name = String((form.elements.namedItem('name') as HTMLInputElement)?.value ?? '').trim();
    const phone = String((form.elements.namedItem('phone') as HTMLInputElement)?.value ?? '').trim();
    const email = String((form.elements.namedItem('email') as HTMLInputElement)?.value ?? '').trim();
    const telegram = String((form.elements.namedItem('telegram') as HTMLInputElement)?.value ?? '').trim() || undefined;
    const whatsapp = String((form.elements.namedItem('whatsapp') as HTMLInputElement)?.value ?? '').trim() || undefined;
    const vk = String((form.elements.namedItem('vk') as HTMLInputElement)?.value ?? '').trim() || undefined;

    if (!name || !phone) {
      setError('Укажите имя и телефон');
      setLoading(false);
      return;
    }

    try {
      let photo = photoUrl.trim();
      if (photoFile) {
        setUploadingPhoto(true);
        photo = await handlePhotoUpload(photoFile);
        setUploadingPhoto(false);
      }

      if (editingId) {
        const res = await fetch(`/api/agents/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email: email || undefined, photo: photo || undefined, telegram, whatsapp, vk })
        });
        if (!res.ok) throw new Error('Ошибка обновления');
        const updated = await res.json();
        setAgents((a) => a.map((x) => (x.id === editingId ? updated : x)));
        setEditingId(null);
      } else {
        const res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email: email || undefined, photo: photo || undefined, telegram, whatsapp, vk })
        });
        if (!res.ok) throw new Error('Ошибка сохранения');
        const created = await res.json();
        setAgents((a) => [...a, created]);
      }

      (form as HTMLFormElement).reset();
      setPhotoUrl('');
      setPhotoFile(null);
      alert(editingId ? 'Агент обновлён' : 'Агент добавлен');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить агента?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/agents/${id}`, { method: 'DELETE' });
      if (res.ok) setAgents((a) => a.filter((x) => x.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(a: Agent) {
    setEditingId(a.id);
    setPhotoUrl(a.photo || '');
    setPhotoFile(null);
    const form = document.getElementById('agent-form');
    if (form) {
      (form.querySelector('[name="name"]') as HTMLInputElement).value = a.name;
      (form.querySelector('[name="phone"]') as HTMLInputElement).value = a.phone;
      (form.querySelector('[name="email"]') as HTMLInputElement).value = a.email || '';
      (form.querySelector('[name="telegram"]') as HTMLInputElement).value = a.telegram || '';
      (form.querySelector('[name="whatsapp"]') as HTMLInputElement).value = a.whatsapp || '';
      (form.querySelector('[name="vk"]') as HTMLInputElement).value = a.vk || '';
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setPhotoUrl('');
    setPhotoFile(null);
    (document.getElementById('agent-form') as HTMLFormElement)?.reset();
  }

  function getUserForAgent(agentId: string): AgentUser | undefined {
    return agentUsers.find((u) => u.agentId === agentId);
  }

  async function handleCreateCabinet(agentId: string) {
    setCabinetError('');
    setCabinetLoading(true);
    try {
      const agent = agents.find((a) => a.id === agentId);
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: cabinetLogin.trim(),
          password: cabinetPassword,
          name: agent?.name || cabinetLogin,
          agentId
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCabinetError(data.message || 'Ошибка');
        return;
      }
      setAgentUsers((prev) => [...prev, data]);
      setCreatingForAgentId(null);
      setCabinetLogin('');
      setCabinetPassword('');
    } finally {
      setCabinetLoading(false);
    }
  }

  async function handleChangePassword(userId: string) {
    if (!newPassword || newPassword.length < 6) {
      setCabinetError('Пароль не менее 6 символов');
      return;
    }
    setCabinetError('');
    setCabinetLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      if (res.ok) {
        setChangingPasswordId(null);
        setNewPassword('');
      } else {
        const data = await res.json().catch(() => ({}));
        setCabinetError(data.message || 'Ошибка');
      }
    } finally {
      setCabinetLoading(false);
    }
  }

  async function handleDeleteCabinet(userId: string) {
    if (!confirm('Удалить доступ к панели агента?')) return;
    setDeletingUserId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setAgentUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } finally {
      setDeletingUserId(null);
    }
  }

  async function handleTelegramSave(e: FormEvent) {
    e.preventDefault();
    setTelegramSaving(true);
    setTelegramSaved(false);
    try {
      const res = await fetch('/api/settings/telegram', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramChannelId: telegramChannelId.trim() })
      });
      if (res.ok) {
        setTelegramSaved(true);
        setTimeout(() => setTelegramSaved(false), 3000);
      }
    } finally {
      setTelegramSaving(false);
    }
  }

  async function handleSaveSiteSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!siteSettings) return;
    setSiteSaving(true);
    setSiteSaved(false);
    const form = e.currentTarget;
    const next: SiteSettings = {
      ...siteSettings,
      name: String((form.elements.namedItem('siteName') as HTMLInputElement)?.value ?? '').trim(),
      inn: String((form.elements.namedItem('siteInn') as HTMLInputElement)?.value ?? '').trim(),
      kpp: String((form.elements.namedItem('siteKpp') as HTMLInputElement)?.value ?? '').trim() || undefined,
      ogrn: String((form.elements.namedItem('siteOgrn') as HTMLInputElement)?.value ?? '').trim() || undefined,
      address: String((form.elements.namedItem('siteAddress') as HTMLInputElement)?.value ?? '').trim(),
      phone: String((form.elements.namedItem('sitePhone') as HTMLInputElement)?.value ?? '').trim(),
      email: String((form.elements.namedItem('siteEmail') as HTMLInputElement)?.value ?? '').trim(),
      bankName: String((form.elements.namedItem('siteBankName') as HTMLInputElement)?.value ?? '').trim() || undefined,
      bik: String((form.elements.namedItem('siteBik') as HTMLInputElement)?.value ?? '').trim() || undefined,
      bankAccount: String((form.elements.namedItem('siteBankAccount') as HTMLInputElement)?.value ?? '').trim() || undefined,
      corrAccount: String((form.elements.namedItem('siteCorrAccount') as HTMLInputElement)?.value ?? '').trim() || undefined,
      aboutShort: String((form.elements.namedItem('siteAboutShort') as HTMLInputElement)?.value ?? '').trim() || undefined,
      aboutPageContent: String((form.elements.namedItem('siteAboutPageContent') as HTMLTextAreaElement)?.value ?? '').trim() || undefined,
      footerDisclaimer: String((form.elements.namedItem('siteFooterDisclaimer') as HTMLTextAreaElement)?.value ?? '').trim() || undefined,
      policyUrl: String((form.elements.namedItem('sitePolicyUrl') as HTMLInputElement)?.value ?? '').trim() || undefined,
      offerUrl: String((form.elements.namedItem('siteOfferUrl') as HTMLInputElement)?.value ?? '').trim() || undefined,
      trustObjects: String((form.elements.namedItem('siteTrustObjects') as HTMLInputElement)?.value ?? '').trim() || undefined,
      trustYears: String((form.elements.namedItem('siteTrustYears') as HTMLInputElement)?.value ?? '').trim() || undefined,
      trustAmount: String((form.elements.namedItem('siteTrustAmount') as HTMLInputElement)?.value ?? '').trim() || undefined,
      howWeWorkSteps: String((form.elements.namedItem('siteHowWeWorkSteps') as HTMLTextAreaElement)?.value ?? '').trim() || undefined,
      faqContent: String((form.elements.namedItem('siteFaqContent') as HTMLTextAreaElement)?.value ?? '').trim() || undefined,
      caseStudies: String((form.elements.namedItem('siteCaseStudies') as HTMLTextAreaElement)?.value ?? '').trim() || undefined,
      reviewsContent: String((form.elements.namedItem('siteReviewsContent') as HTMLTextAreaElement)?.value ?? '').trim() || undefined,
      cookieConsentText: String((form.elements.namedItem('siteCookieConsentText') as HTMLInputElement)?.value ?? '').trim() || undefined,
      yandexMetrikaId: String((form.elements.namedItem('siteYandexMetrikaId') as HTMLInputElement)?.value ?? '').trim() || undefined
    };
    try {
      const res = await fetch('/api/settings/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      });
      if (res.ok) {
        const updated = await res.json();
        setSiteSettings(updated);
        setSiteSaved(true);
        setTimeout(() => setSiteSaved(false), 3000);
      }
    } finally {
      setSiteSaving(false);
    }
  }

  return (
    <div className="container-page space-y-6">
      <section className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs text-slate-900">
          <User className="h-3 w-3" />
          Панель администратора
        </div>
        <h1 className="text-xl font-semibold text-slate-900">
          Управление агентами
        </h1>
        <p className="text-sm text-slate-800">
          Добавляйте и редактируйте агентов. Каждому агенту можно назначить объекты в панели агента.
        </p>
      </section>

      {/* Данные сайта: телефон, почта, реквизиты, блок «О компании» */}
      <section className="card p-4 md:p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Данные сайта
        </h2>
        <p className="text-xs text-slate-800 mb-4">
          Телефон, почта, реквизиты. Текст страницы «О компании» редактируется по согласованию с руководством.
        </p>
        {siteSettings ? (
          <form onSubmit={handleSaveSiteSettings} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Название компании</span>
                <input name="siteName" defaultValue={siteSettings.name} className="input-field" placeholder="ООО «РУНЕД»" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">ИНН</span>
                <input name="siteInn" defaultValue={siteSettings.inn} className="input-field" placeholder="7734497068" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">КПП</span>
                <input name="siteKpp" defaultValue={siteSettings.kpp ?? ''} className="input-field" placeholder="773401001" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">ОГРН</span>
                <input name="siteOgrn" defaultValue={siteSettings.ogrn ?? ''} className="input-field" placeholder="1234567890123" />
              </label>
              <label className="space-y-1 block sm:col-span-2">
                <span className="text-slate-900 text-sm">Юридический адрес</span>
                <input name="siteAddress" defaultValue={siteSettings.address} className="input-field" placeholder="г. Москва, ул. Бурденко, д. 14" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Телефон</span>
                <input name="sitePhone" defaultValue={siteSettings.phone} type="tel" className="input-field" placeholder="+7 (495) 123-45-67" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Email</span>
                <input name="siteEmail" defaultValue={siteSettings.email} type="email" className="input-field" placeholder="info@example.ru" />
              </label>
              <label className="space-y-1 block sm:col-span-2 lg:col-span-3">
                <span className="text-slate-900 text-sm">Текст страницы «О компании»</span>
                <textarea name="siteAboutPageContent" defaultValue={siteSettings.aboutPageContent ?? ''} className="input-field min-h-[120px]" placeholder="Информация о компании: опыт, кейсы, цифры. По согласованию с руководством." rows={6} />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Банк (наименование)</span>
                <input name="siteBankName" defaultValue={siteSettings.bankName ?? ''} className="input-field" placeholder="ПАО Сбербанк" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">БИК</span>
                <input name="siteBik" defaultValue={siteSettings.bik ?? ''} className="input-field" placeholder="044525225" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Расчётный счёт</span>
                <input name="siteBankAccount" defaultValue={siteSettings.bankAccount ?? ''} className="input-field" placeholder="40702810000000000000" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Корр. счёт</span>
                <input name="siteCorrAccount" defaultValue={siteSettings.corrAccount ?? ''} className="input-field" placeholder="30101810000000000000" />
              </label>
              <label className="space-y-1 block sm:col-span-2 lg:col-span-3">
                <span className="text-slate-900 text-sm">Текст в подвале (дисклеймер)</span>
                <textarea name="siteFooterDisclaimer" defaultValue={siteSettings.footerDisclaimer ?? ''} className="input-field min-h-[80px]" placeholder="Информация не является публичной офертой..." rows={3} />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Ссылка на политику конфиденциальности</span>
                <input name="sitePolicyUrl" defaultValue={siteSettings.policyUrl ?? ''} type="url" className="input-field" placeholder="https://..." />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Ссылка на оферту</span>
                <input name="siteOfferUrl" defaultValue={siteSettings.offerUrl ?? ''} type="url" className="input-field" placeholder="https://..." />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Доверие: объекты</span>
                <input name="siteTrustObjects" defaultValue={siteSettings.trustObjects ?? ''} className="input-field" placeholder="5+" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Доверие: лет на рынке</span>
                <input name="siteTrustYears" defaultValue={siteSettings.trustYears ?? ''} className="input-field" placeholder="8" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Доверие: объём</span>
                <input name="siteTrustAmount" defaultValue={siteSettings.trustAmount ?? ''} className="input-field" placeholder="500+ млн ₽" />
              </label>
              <label className="space-y-1 block sm:col-span-2 lg:col-span-3">
                <span className="text-slate-900 text-sm">Как мы работаем (каждая строка — этап)</span>
                <textarea name="siteHowWeWorkSteps" defaultValue={siteSettings.howWeWorkSteps ?? ''} className="input-field min-h-[100px]" placeholder="Консультация&#10;Договор&#10;Реализация" rows={4} />
              </label>
              <label className="space-y-1 block sm:col-span-2 lg:col-span-3">
                <span className="text-slate-900 text-sm">FAQ (каждая строка: Вопрос|Ответ)</span>
                <textarea name="siteFaqContent" defaultValue={siteSettings.faqContent ?? ''} className="input-field min-h-[120px]" placeholder="Как оформить?|Оформление через договор..." rows={5} />
              </label>
              <label className="space-y-1 block sm:col-span-2 lg:col-span-3">
                <span className="text-slate-900 text-sm">Кейсы (каждая строка: Заголовок|Текст)</span>
                <textarea name="siteCaseStudies" defaultValue={siteSettings.caseStudies ?? ''} className="input-field min-h-[100px]" placeholder="Объект на Тверской|Успешно реализован..." rows={4} />
              </label>
              <label className="space-y-1 block sm:col-span-2 lg:col-span-3">
                <span className="text-slate-900 text-sm">Отзывы (каждая строка: Заголовок|Текст, показываются внизу главной)</span>
                <textarea name="siteReviewsContent" defaultValue={siteSettings.reviewsContent ?? ''} className="input-field min-h-[100px]" placeholder="Имя|Текст отзыва..." rows={4} />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">Текст cookie-плашки (пусто — не показывать)</span>
                <input name="siteCookieConsentText" defaultValue={siteSettings.cookieConsentText ?? ''} className="input-field" placeholder="Мы используем cookie..." />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900 text-sm">ID Яндекс.Метрики</span>
                <input name="siteYandexMetrikaId" defaultValue={siteSettings.yandexMetrikaId ?? ''} className="input-field" placeholder="12345678" />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={siteSaving} className="btn-primary inline-flex items-center gap-2">
                {siteSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {siteSaved ? 'Сохранено' : 'Сохранить данные сайта'}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-slate-800">Загрузка...</p>
        )}
      </section>

      <section className="card p-4 md:p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          {editingId ? 'Редактирование агента' : 'Добавить агента'}
        </h2>
        <form id="agent-form" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={handleSubmit}>
          <label className="space-y-1 block">
            <span className="text-slate-900">Имя</span>
            <input name="name" className="input-field" placeholder="Иван Иванов" required />
          </label>
          <label className="space-y-1 block">
            <span className="text-slate-900">Телефон</span>
            <input name="phone" type="tel" className="input-field" placeholder="+7 (999) 123-45-67" required />
          </label>
          <label className="space-y-1 block">
            <span className="text-slate-900">Email</span>
            <input name="email" type="email" className="input-field" placeholder="agent@example.com" />
          </label>
          <label className="space-y-1 block">
            <span className="text-slate-900">Telegram</span>
            <input name="telegram" type="url" className="input-field" placeholder="https://t.me/username" />
          </label>
          <label className="space-y-1 block">
            <span className="text-slate-900">WhatsApp</span>
            <input name="whatsapp" type="url" className="input-field" placeholder="https://wa.me/79001234567" />
          </label>
          <label className="space-y-1 block">
            <span className="text-slate-900">ВКонтакте</span>
            <input name="vk" type="url" className="input-field" placeholder="https://vk.com/username" />
          </label>

          <div className="sm:col-span-2 lg:col-span-3 space-y-2">
            <span className="text-slate-900 block">Фото агента</span>
            <div className="flex flex-wrap gap-3 items-start">
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoUrl('');
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-xs ${!photoFile && !photoUrl ? 'border-brand bg-orange-50 text-orange-800' : 'border-slate-300 text-slate-800'}`}
                >
                  <LinkIcon className="inline h-3 w-3 mr-1" /> URL
                </button>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => { setPhotoUrl(e.target.value); setPhotoFile(null); }}
                  className="input-field max-w-xs"
                  placeholder="Ссылка на фото"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-800 text-xs">или</span>
                <input
                  type="file"
                  accept="image/*"
                  className="block text-sm text-slate-800 file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-1.5 file:text-orange-800"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setPhotoFile(f || null);
                    if (f) setPhotoUrl('');
                  }}
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap gap-3">
            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button type="submit" className="btn-primary inline-flex items-center gap-2" disabled={loading || uploadingPhoto}>
              {loading || uploadingPhoto ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="h-4 w-4" />
              )}
              {editingId ? 'Сохранить' : 'Добавить агента'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-full border border-slate-300 text-slate-800 hover:bg-slate-50 text-sm">
                Отмена
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card p-4 md:p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Список агентов</h2>
        {agents.length === 0 ? (
          <p className="text-sm text-slate-800">Агентов пока нет. Добавьте первого.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((a) => (
              <li
                key={a.id}
                className="flex gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                  {a.photo ? (
                    <ProjectImage src={a.photo} alt={a.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <User className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate">{a.name}</p>
                  <p className="text-sm text-slate-800">{a.phone}</p>
                  {a.email && <p className="text-xs text-slate-800 truncate">{a.email}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(a)}
                    className="p-2 text-slate-800 hover:bg-slate-200 rounded-lg"
                    title="Редактировать"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    disabled={deletingId === a.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    title="Удалить"
                  >
                    {deletingId === a.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-4 md:p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <KeyRound className="h-4 w-4" />
          Настройки агентских кабинетов
        </h2>
        <p className="text-xs text-slate-800 mb-4">
          Создайте учётные записи для агентов, чтобы они могли входить в панель и добавлять объекты.
        </p>
        {agents.length === 0 ? (
          <p className="text-sm text-slate-800">Сначала добавьте агентов выше.</p>
        ) : (
          <ul className="space-y-4">
            {agents.map((a) => {
              const user = getUserForAgent(a.id);
              const isCreating = creatingForAgentId === a.id;
              const isChanging = user && changingPasswordId === user.id;
              return (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                      {a.photo ? (
                        <ProjectImage src={a.photo} alt={a.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{a.name}</p>
                      <p className="text-xs text-slate-800">{a.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user ? (
                      <>
                        <span className="text-xs text-slate-600">Логин: {user.login}</span>
                        {isChanging ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Новый пароль"
                              className="input-field text-sm w-32"
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => handleChangePassword(user.id)}
                              disabled={cabinetLoading}
                              className="btn-primary text-xs py-1.5 px-2"
                            >
                              {cabinetLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'OK'}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setChangingPasswordId(null); setNewPassword(''); setCabinetError(''); }}
                              className="text-slate-600 hover:text-slate-800 text-xs"
                            >
                              Отмена
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setChangingPasswordId(user.id)}
                            className="text-xs text-brand hover:underline"
                          >
                            Сменить пароль
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteCabinet(user.id)}
                          disabled={deletingUserId === user.id}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          title="Удалить доступ"
                        >
                          {deletingUserId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                        </button>
                      </>
                    ) : isCreating ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={cabinetLogin}
                          onChange={(e) => setCabinetLogin(e.target.value)}
                          placeholder="Логин (телефон)"
                          className="input-field text-sm w-36"
                        />
                        <input
                          type="password"
                          value={cabinetPassword}
                          onChange={(e) => setCabinetPassword(e.target.value)}
                          placeholder="Пароль (6+ символов)"
                          className="input-field text-sm w-36"
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => handleCreateCabinet(a.id)}
                          disabled={cabinetLoading || !cabinetLogin.trim() || cabinetPassword.length < 6}
                          className="btn-primary text-xs py-1.5 px-2"
                        >
                          {cabinetLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Создать'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setCreatingForAgentId(null); setCabinetLogin(''); setCabinetPassword(''); setCabinetError(''); }}
                          className="text-slate-600 hover:text-slate-800 text-xs"
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCreatingForAgentId(a.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-800 hover:bg-slate-50"
                      >
                        <KeyRound className="h-3 w-3" />
                        Создать доступ
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {cabinetError && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {cabinetError}
          </p>
        )}
      </section>

      <section className="card p-4 md:p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <Send className="h-4 w-4" />
          Настройки Telegram
        </h2>
        <p className="text-xs text-slate-800 mb-4">
          Публикация объектов в канал инвесторов. Bot Token задаётся в переменной окружения TELEGRAM_BOT_TOKEN.
          Channel ID — введите числовой ID канала (например -100xxxxxxxxxx) или @username.
        </p>
        <form onSubmit={handleTelegramSave} className="space-y-4 max-w-md">
          <div className="flex items-center gap-2 text-sm">
            {telegramHasToken ? (
              <span className="text-emerald-600">Bot Token: настроено</span>
            ) : (
              <span className="text-amber-600">Bot Token: не задан (добавьте TELEGRAM_BOT_TOKEN в .env)</span>
            )}
          </div>
          <label className="space-y-1 block">
            <span className="text-slate-900">Channel ID</span>
            <input
              type="text"
              value={telegramChannelId}
              onChange={(e) => setTelegramChannelId(e.target.value)}
              className="input-field"
              placeholder="-100xxxxxxxxxx или @channel"
            />
          </label>
          <button
            type="submit"
            disabled={telegramSaving}
            className="btn-primary inline-flex items-center gap-2"
          >
            {telegramSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {telegramSaved ? 'Сохранено' : 'Сохранить настройки'}
          </button>
        </form>
      </section>
    </div>
  );
}
