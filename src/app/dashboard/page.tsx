'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Loader2, PlusCircle, Link as LinkIcon, Upload, Trash2, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { TelegramPublishButton } from '@/components/project/TelegramPublishButton';
import type { ProjectStatus } from '@/types/project';
import type { Agent } from '@/types/agent';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';

type ImageSource = 'url' | 'file';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<{ id: string; address: string; metro: string; status: string }[]>([]);
  const statusLabel: Record<string, string> = { active: 'В продаже', renovation: 'Ремонт', sold: 'Реализован' };
  const [agents, setAgents] = useState<Agent[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [beforeSource, setBeforeSource] = useState<ImageSource>('url');
  const [afterSource, setAfterSource] = useState<ImageSource>('url');
  const [beforeFileUrl, setBeforeFileUrl] = useState<string>('');
  const [afterFileUrl, setAfterFileUrl] = useState<string>('');
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

  const { data: session } = useSession();
  const settings = useSiteSettings();
  const sessionAgentId = (session as any)?.agentId;
  const isAgent = (session as any)?.role === 'agent';
  const currentAgent = agents.find((a) => a.id === sessionAgentId) ?? null;

  const [linkTelegram, setLinkTelegram] = useState('');
  const [linkWhatsapp, setLinkWhatsapp] = useState('');
  const [linkVk, setLinkVk] = useState('');
  const [linksSaving, setLinksSaving] = useState(false);
  const [linksSaved, setLinksSaved] = useState(false);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => setProjects(data))
      .catch(() => setProjects([]));
    fetch('/api/agents')
      .then((r) => r.json())
      .then((data) => setAgents(data))
      .catch(() => setAgents([]));
  }, []);

  useEffect(() => {
    if (currentAgent) {
      setLinkTelegram(currentAgent.telegram ?? '');
      setLinkWhatsapp(currentAgent.whatsapp ?? '');
      setLinkVk(currentAgent.vk ?? '');
    }
  }, [currentAgent?.id, currentAgent?.telegram, currentAgent?.whatsapp, currentAgent?.vk]);

  async function handleFileUpload(file: File, side: 'before' | 'after') {
    const setUploading = side === 'before' ? setUploadingBefore : setUploadingAfter;
    const setUrl = side === 'before' ? setBeforeFileUrl : setAfterFileUrl;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка загрузки');
      }
      const { url } = await res.json();
      setUrl(url);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить объект?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((p) => p.filter((x) => x.id !== id));
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const address = String(formData.get('address') ?? '').trim();
    const metro = String(formData.get('metro') ?? '').trim();
    const price = Number(formData.get('price') ?? 0);
    const profit = Number(formData.get('profit') ?? 0);
    const status = String(formData.get('status') ?? 'active') as ProjectStatus;
    const description = String(formData.get('description') ?? '').trim();
    const agentId = String(formData.get('agentId') ?? '').trim() || undefined;

    const beforeImage = beforeSource === 'url'
      ? String(formData.get('beforeImageUrl') ?? '').trim()
      : beforeFileUrl;
    const afterImage = afterSource === 'url'
      ? String(formData.get('afterImageUrl') ?? '').trim()
      : afterFileUrl;

    if (!address || !metro || !price || !profit || !status || !description || !beforeImage || !afterImage) {
      setError('Заполните все поля и добавьте оба изображения (до и после).');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          metro,
          price,
          profit,
          status,
          description,
          images: [beforeImage, afterImage],
          agentId
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Не удалось сохранить объект');
      }

      alert('Объект успешно добавлен в каталог.');
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Неожиданная ошибка. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  async function handleSaveLinks(e: FormEvent) {
    e.preventDefault();
    if (!sessionAgentId) return;
    setLinksSaving(true);
    setLinksSaved(false);
    try {
      const res = await fetch(`/api/agents/${sessionAgentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram: linkTelegram.trim() || undefined,
          whatsapp: linkWhatsapp.trim() || undefined,
          vk: linkVk.trim() || undefined
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setAgents((prev) => prev.map((a) => (a.id === sessionAgentId ? updated : a)));
        setLinksSaved(true);
        setTimeout(() => setLinksSaved(false), 2000);
      }
    } finally {
      setLinksSaving(false);
    }
  }

  return (
    <div className="container-page space-y-6">
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-800">
            <PlusCircle className="h-3 w-3" />
            Панель агента
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            Добавление нового объекта
          </h1>
        </div>
      </section>

      {/* Ссылки агента (Telegram, WhatsApp, VK) — только для агента */}
      {isAgent && currentAgent && (
        <section className="card p-4 md:p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Мои контакты для клиентов
          </h2>
          <p className="text-xs text-slate-800 mb-4">
            Ссылки на мессенджеры будут отображаться на карточках объектов, закреплённых за вами.
          </p>
          <form onSubmit={handleSaveLinks} className="space-y-3 max-w-lg">
            <label className="block">
              <span className="text-slate-900 text-sm">Telegram</span>
              <input
                type="url"
                value={linkTelegram}
                onChange={(e) => setLinkTelegram(e.target.value)}
                className="input-field mt-1"
                placeholder="https://t.me/username"
              />
            </label>
            <label className="block">
              <span className="text-slate-900 text-sm">WhatsApp</span>
              <input
                type="url"
                value={linkWhatsapp}
                onChange={(e) => setLinkWhatsapp(e.target.value)}
                className="input-field mt-1"
                placeholder="https://wa.me/79001234567"
              />
            </label>
            <label className="block">
              <span className="text-slate-900 text-sm">ВКонтакте</span>
              <input
                type="url"
                value={linkVk}
                onChange={(e) => setLinkVk(e.target.value)}
                className="input-field mt-1"
                placeholder="https://vk.com/username"
              />
            </label>
            <button type="submit" disabled={linksSaving} className="btn-primary inline-flex items-center gap-2 text-sm">
              {linksSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {linksSaved ? 'Сохранено' : 'Сохранить ссылки'}
            </button>
          </form>
        </section>
      )}

      {/* Контактные данные */}
      <section className="card p-4 md:p-5 border-orange-100 bg-orange-50/50">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Наши контакты</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-slate-900 hover:text-brand">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{settings.phone}</span>
          </a>
          <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-slate-900 hover:text-brand">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span>{settings.email}</span>
          </a>
          <div className="flex items-start gap-2 text-slate-900 sm:col-span-2">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{settings.address}, {settings.name}, ИНН {settings.inn}</span>
          </div>
        </div>
      </section>

      {/* Список объектов с удалением */}
      {projects.length > 0 && (
        <section className="card p-4 md:p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Текущие объекты</h2>
          <ul className="space-y-2">
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate">{p.address}</p>
                  <p className="text-xs text-slate-700">{p.metro} · {statusLabel[p.status] || p.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/projects/${p.id}`} className="text-sm text-brand hover:underline">
                    Карточка
                  </Link>
                  <TelegramPublishButton projectId={p.id} variant="compact" />
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Удалить"
                  >
                    {deletingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Форма добавления */}
      <section className="card p-4 md:p-5">
        <form className="grid gap-4 md:grid-cols-2 text-sm" onSubmit={handleSubmit}>
          <div className="space-y-3 md:col-span-2">
            <label className="space-y-1 block">
              <span className="text-slate-900">Адрес объекта</span>
              <input name="address" className="input-field" placeholder="г. Москва, ул. Пример, д. 1" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-1 block">
                <span className="text-slate-900">Ближайшее метро</span>
                <input name="metro" className="input-field" placeholder="Парк культуры" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900">Цена входа, ₽</span>
                <input name="price" type="number" min={0} className="input-field" placeholder="15000000" />
              </label>
              <label className="space-y-1 block">
                <span className="text-slate-900">Целевая доходность, %</span>
                <input name="profit" type="number" step="0.1" min={0} className="input-field" placeholder="16" />
              </label>
            </div>
            {agents.length > 0 && (
              <label className="space-y-1 block">
                <span className="text-slate-900">Закрепить за агентом</span>
                <select name="agentId" className="input-field" defaultValue={isAgent ? sessionAgentId ?? '' : ''}>
                  <option value="">— не выбран —</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.phone})</option>
                  ))}
                </select>
                {isAgent && sessionAgentId && (
                  <span className="text-xs text-slate-600 block mt-1">По умолчанию выбран ваш профиль. Администратор может изменить при необходимости.</span>
                )}
              </label>
            )}
          </div>

          <div className="space-y-3">
            <label className="space-y-1 block">
              <span className="text-slate-900">Статус</span>
              <select name="status" className="input-field" defaultValue="active">
                <option value="active">В продаже</option>
                <option value="renovation">Ремонт</option>
                <option value="sold">Реализован</option>
              </select>
            </label>

            <div className="space-y-2">
              <span className="text-slate-900 block">Фото «до ремонта»</span>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setBeforeSource('url')}
                  className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${beforeSource === 'url' ? 'border-brand bg-orange-50 text-orange-800' : 'border-slate-300 text-slate-800 hover:bg-slate-50'}`}
                >
                  <LinkIcon className="h-3 w-3" /> По ссылке
                </button>
                <button
                  type="button"
                  onClick={() => setBeforeSource('file')}
                  className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${beforeSource === 'file' ? 'border-brand bg-orange-50 text-orange-800' : 'border-slate-300 text-slate-800 hover:bg-slate-50'}`}
                >
                  <Upload className="h-3 w-3" /> С компьютера
                </button>
              </div>
              {beforeSource === 'url' ? (
                <input name="beforeImageUrl" className="input-field" placeholder="https://..." />
              ) : (
                <div className="space-y-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-slate-800 file:mr-2 file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-1.5 file:text-orange-800"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'before'); }}
                    disabled={uploadingBefore}
                  />
                  {uploadingBefore && <p className="text-xs text-slate-700">Загрузка…</p>}
                  {beforeFileUrl && <p className="text-xs text-emerald-700">Загружено</p>}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-slate-900 block">Фото «после ремонта»</span>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setAfterSource('url')}
                  className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${afterSource === 'url' ? 'border-brand bg-orange-50 text-orange-800' : 'border-slate-300 text-slate-800 hover:bg-slate-50'}`}
                >
                  <LinkIcon className="h-3 w-3" /> По ссылке
                </button>
                <button
                  type="button"
                  onClick={() => setAfterSource('file')}
                  className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${afterSource === 'file' ? 'border-brand bg-orange-50 text-orange-800' : 'border-slate-300 text-slate-800 hover:bg-slate-50'}`}
                >
                  <Upload className="h-3 w-3" /> С компьютера
                </button>
              </div>
              {afterSource === 'url' ? (
                <input name="afterImageUrl" className="input-field" placeholder="https://..." />
              ) : (
                <div className="space-y-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-slate-800 file:mr-2 file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-1.5 file:text-orange-800"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'after'); }}
                    disabled={uploadingAfter}
                  />
                  {uploadingAfter && <p className="text-xs text-slate-700">Загрузка…</p>}
                  {afterFileUrl && <p className="text-xs text-emerald-700">Загружено</p>}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="space-y-1 block">
              <span className="text-slate-900">Описание проекта</span>
              <textarea
                name="description"
                rows={6}
                className="input-field resize-none"
                placeholder="Опишите концепцию, формат и целевую аудиторию..."
              />
            </label>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2 sm:mr-auto">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="btn-primary inline-flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Сохраняем...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Добавить объект
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
