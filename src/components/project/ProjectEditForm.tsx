'use client';

import { FormEvent, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Pencil, X, Link as LinkIcon, Upload } from 'lucide-react';
import type { Project } from '@/types/project';
import type { Agent } from '@/types/agent';
type ImageSource = 'url' | 'file';

interface ProjectEditFormProps {
  project: Project;
  agents: Agent[];
}

export function ProjectEditForm({ project, agents }: ProjectEditFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = (session as any)?.role;
  const canEdit = status === 'authenticated' && (role === 'admin' || role === 'agent');

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [beforeSource, setBeforeSource] = useState<ImageSource>('url');
  const [afterSource, setAfterSource] = useState<ImageSource>('url');
  const [beforeFileUrl, setBeforeFileUrl] = useState('');
  const [afterFileUrl, setAfterFileUrl] = useState('');
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const address = String(formData.get('address') ?? '').trim();
    const metro = String(formData.get('metro') ?? '').trim();
    const price = Number(formData.get('price') ?? 0);
    const profit = Number(formData.get('profit') ?? 0);
    const status = String(formData.get('status') ?? 'active');
    const description = String(formData.get('description') ?? '').trim();
    const agentId = String(formData.get('agentId') ?? '').trim() || undefined;

    const beforeImage = beforeSource === 'url'
      ? String(formData.get('beforeImageUrl') ?? '').trim()
      : beforeFileUrl;
    const afterImage = afterSource === 'url'
      ? String(formData.get('afterImageUrl') ?? '').trim()
      : afterFileUrl;

    const hasBefore = beforeSource === 'url' ? !!beforeImage : !!beforeFileUrl;
    const hasAfter = afterSource === 'url' ? !!afterImage : !!afterFileUrl;

    if (!address || !metro || !price || !profit || !status || !description || !hasBefore || !hasAfter) {
      setError('Заполните все поля и добавьте оба изображения.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          metro,
          price,
          profit,
          status,
          description,
          images: [beforeImage || project.images[0], afterImage || project.images[1]],
          agentId
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка сохранения');
      }

      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  }

  if (!canEdit) return null;

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50 transition-colors"
      >
        <Pencil className="h-4 w-4" />
        Редактировать объект
      </button>
    );
  }

  return (
    <div className="card p-4 md:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Редактирование объекта</h2>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-slate-900 text-sm">Адрес</span>
          <input name="address" defaultValue={project.address} className="input-field mt-1" required />
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="text-slate-900 text-sm">Метро</span>
            <input name="metro" defaultValue={project.metro} className="input-field mt-1" required />
          </label>
          <label className="block">
            <span className="text-slate-900 text-sm">Цена входа, ₽</span>
            <input name="price" type="number" defaultValue={project.price} min={0} className="input-field mt-1" required />
          </label>
          <label className="block">
            <span className="text-slate-900 text-sm">Доходность, %</span>
            <input name="profit" type="number" step="0.1" defaultValue={project.profit} min={0} className="input-field mt-1" required />
          </label>
          <label className="block">
            <span className="text-slate-900 text-sm">Статус</span>
            <select name="status" defaultValue={project.status} className="input-field mt-1">
              <option value="active">В продаже</option>
              <option value="renovation">Ремонт</option>
              <option value="sold">Реализован</option>
            </select>
          </label>
        </div>
        {agents.length > 0 && (
          <label className="block">
            <span className="text-slate-900 text-sm">Агент</span>
            <select name="agentId" defaultValue={project.agentId ?? ''} className="input-field mt-1">
              <option value="">— не выбран —</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name} ({a.phone})</option>
              ))}
            </select>
          </label>
        )}

        <label className="block">
          <span className="text-slate-900 text-sm">Описание</span>
          <textarea name="description" rows={4} defaultValue={project.description} className="input-field mt-1 resize-none" required />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <span className="text-slate-900 text-sm block">Фото «до»</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBeforeSource('url')}
                className={`rounded-lg border px-2 py-1.5 text-xs ${beforeSource === 'url' ? 'border-brand bg-orange-50' : 'border-slate-300'}`}
              >
                <LinkIcon className="inline h-3 w-3 mr-1" /> URL
              </button>
              <button
                type="button"
                onClick={() => setBeforeSource('file')}
                className={`rounded-lg border px-2 py-1.5 text-xs ${beforeSource === 'file' ? 'border-brand bg-orange-50' : 'border-slate-300'}`}
              >
                <Upload className="inline h-3 w-3 mr-1" /> Файл
              </button>
            </div>
            {beforeSource === 'url' ? (
              <input name="beforeImageUrl" defaultValue={project.images[0]} className="input-field text-sm" placeholder="https://..." />
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="block text-sm file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-1.5"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'before'); }}
                  disabled={uploadingBefore}
                />
                {beforeFileUrl && <p className="text-xs text-emerald-600 mt-1">Загружено</p>}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <span className="text-slate-900 text-sm block">Фото «после»</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAfterSource('url')}
                className={`rounded-lg border px-2 py-1.5 text-xs ${afterSource === 'url' ? 'border-brand bg-orange-50' : 'border-slate-300'}`}
              >
                <LinkIcon className="inline h-3 w-3 mr-1" /> URL
              </button>
              <button
                type="button"
                onClick={() => setAfterSource('file')}
                className={`rounded-lg border px-2 py-1.5 text-xs ${afterSource === 'file' ? 'border-brand bg-orange-50' : 'border-slate-300'}`}
              >
                <Upload className="inline h-3 w-3 mr-1" /> Файл
              </button>
            </div>
            {afterSource === 'url' ? (
              <input name="afterImageUrl" defaultValue={project.images[1]} className="input-field text-sm" placeholder="https://..." />
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="block text-sm file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-1.5"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'after'); }}
                  disabled={uploadingAfter}
                />
                {afterFileUrl && <p className="text-xs text-emerald-600 mt-1">Загружено</p>}
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
          Сохранить
        </button>
      </form>
    </div>
  );
}
