'use client';

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Star, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Product, User } from '@/lib/types';

// Thu nhỏ ảnh trên trình duyệt trước khi tải lên cho nhẹ
function resizeImage(file: File, max = 1000): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('Không đọc được ảnh'))), 'image/jpeg', 0.85);
    };
    img.onerror = () => reject(new Error('Không đọc được ảnh'));
    img.src = URL.createObjectURL(file);
  });
}

type Draft = Omit<Product, 'id' | 'ownerName'> & { id?: string };

const EMPTY: Draft = { ownerId: '', title: '', category: '', images: [], rentalPricePerDay: 0, depositAmount: 0, durationDays: 1 };

export default function ProductForm({ initial, onSaved, onCancel }: {
  initial?: Product; onSaved: () => void; onCancel: () => void;
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [p, setP] = useState<Draft>(initial ?? EMPTY);
  const [lenders, setLenders] = useState<User[]>([]);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Admin chọn được sản phẩm thuộc người cho thuê nào
  useEffect(() => {
    if (isAdmin) api<User[]>('/users?role=lender').then((ls) => {
      setLenders(ls);
      setP((x) => (x.ownerId ? x : { ...x, ownerId: ls[0]?.id ?? '' }));
    });
  }, [isAdmin]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setP((x) => ({ ...x, [k]: v }));

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setErr('');
    setUploading(true);
    try {
      const form = new FormData();
      for (const f of Array.from(files)) form.append('images', await resizeImage(f), f.name.replace(/\.\w+$/, '') + '.jpg');
      const { urls } = await api<{ urls: string[] }>('/uploads', { method: 'POST', body: form });
      setP((x) => ({ ...x, images: [...x.images, ...urls] }));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const addUrl = () => {
    if (!/^https?:\/\//.test(url.trim())) return setErr('Link ảnh phải bắt đầu bằng http:// hoặc https://');
    set('images', [...p.images, url.trim()]);
    setUrl('');
    setErr('');
  };

  const removeImage = (i: number) => set('images', p.images.filter((_, j) => j !== i));
  const makeCover = (i: number) => set('images', [p.images[i], ...p.images.filter((_, j) => j !== i)]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (p.images.length === 0) return setErr('Hãy thêm ít nhất một ảnh sản phẩm');
    setSaving(true);
    setErr('');
    try {
      await api(p.id ? `/products/${p.id}` : '/products', { method: p.id ? 'PUT' : 'POST', body: JSON.stringify(p) });
      onSaved();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const num = (k: 'rentalPricePerDay' | 'depositAmount' | 'durationDays') => ({
    type: 'number', inputMode: 'numeric' as const, min: k === 'durationDays' ? 1 : 0, required: true, value: p[k] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, Number(e.target.value)),
  });

  return (
    <form onSubmit={submit} className="border border-neutral-200 rounded-xl bg-white p-4 space-y-4">
      <h2 className="font-medium">{p.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="sm:col-span-2 text-xs text-neutral-500 space-y-1 block">Tên sản phẩm
          <input className="input" required value={p.title} onChange={(e) => set('title', e.target.value)} />
        </label>
        <label className="text-xs text-neutral-500 space-y-1 block">Danh mục
          <input className="input" required value={p.category} onChange={(e) => set('category', e.target.value)} />
        </label>
        {isAdmin ? (
          <label className="text-xs text-neutral-500 space-y-1 block">Người cho thuê
            <select className="input" value={p.ownerId} onChange={(e) => set('ownerId', e.target.value)}>
              {lenders.map((l) => <option key={l.id} value={l.id}>{l.fullName} (@{l.username})</option>)}
            </select>
          </label>
        ) : (
          <label className="text-xs text-neutral-500 space-y-1 block">Số ngày mượn gợi ý
            <input className="input" {...num('durationDays')} />
          </label>
        )}
        <label className="text-xs text-neutral-500 space-y-1 block">Giá mượn/ngày (đ)
          <input className="input" {...num('rentalPricePerDay')} />
        </label>
        <label className="text-xs text-neutral-500 space-y-1 block">Tiền cọc (đ)
          <input className="input" {...num('depositAmount')} />
        </label>
        {isAdmin && (
          <label className="text-xs text-neutral-500 space-y-1 block">Số ngày mượn gợi ý
            <input className="input" {...num('durationDays')} />
          </label>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs text-neutral-500">Hình sản phẩm (ảnh có viền đậm là ảnh đại diện)</p>
        <div className="flex flex-wrap gap-2">
          {p.images.map((src, i) => (
            <div key={src + i} className="relative w-20 h-20">
              <img src={src} alt={`Ảnh ${i + 1}`} className={`w-20 h-20 rounded-lg object-cover bg-neutral-100 text-[0px] ${i === 0 ? 'ring-2 ring-neutral-900' : ''}`} />
              <div className="absolute inset-x-0 bottom-0 flex justify-between p-1">
                {i > 0 ? (
                  <button type="button" title="Đặt làm ảnh đại diện" aria-label={`Đặt ảnh ${i + 1} làm ảnh đại diện`} onClick={() => makeCover(i)} className="bg-white/90 rounded p-1"><Star className="w-3.5 h-3.5" /></button>
                ) : <span />}
                <button type="button" title="Xóa ảnh" aria-label={`Xóa ảnh ${i + 1}`} onClick={() => removeImage(i)} className="bg-white/90 rounded p-1 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="w-20 h-20 rounded-lg border border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-500 text-[11px] gap-1">
            <ImagePlus className="w-5 h-5" /> {uploading ? 'Đang tải...' : 'Tải ảnh'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
        </div>
        <div className="flex gap-2">
          <input className="input" placeholder="Hoặc dán link ảnh (https://...)" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="button" onClick={addUrl} className="text-sm border border-neutral-300 rounded-lg px-3 shrink-0">Thêm</button>
        </div>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onCancel} className="text-sm border border-neutral-300 rounded-lg">Hủy</button>
        <button className="btn" disabled={saving || uploading}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
      </div>
    </form>
  );
}
