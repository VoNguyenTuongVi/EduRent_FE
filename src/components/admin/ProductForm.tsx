'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Trash2, Star } from 'lucide-react';
import { Product } from '@/mock/mockData';

// Thu nhỏ ảnh trước khi lưu để không làm đầy bộ nhớ trình duyệt
function resizeImage(file: File, max = 600): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

const EMPTY: Product = { id: '', title: '', category: '', images: [], rentalPricePerDay: 0, depositAmount: 0, durationDays: 1, owner: '' };

export default function ProductForm({ initial, onSave, onCancel }: {
  initial?: Product; onSave: (p: Product) => void; onCancel: () => void;
}) {
  const [p, setP] = useState<Product>(initial ?? EMPTY);
  const [url, setUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const imgs = await Promise.all(Array.from(files).map((f) => resizeImage(f)));
    setP((x) => ({ ...x, images: [...x.images, ...imgs] }));
    if (fileRef.current) fileRef.current.value = '';
  };

  const addUrl = () => {
    if (!url.trim()) return;
    set('images', [...p.images, url.trim()]);
    setUrl('');
  };

  const removeImage = (i: number) => set('images', p.images.filter((_, j) => j !== i));
  const makeCover = (i: number) => set('images', [p.images[i], ...p.images.filter((_, j) => j !== i)]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (p.images.length === 0) return alert('Hãy thêm ít nhất một ảnh sản phẩm');
    onSave({ ...p, id: p.id || 'item-' + Date.now() });
  };

  const num = (k: 'rentalPricePerDay' | 'depositAmount' | 'durationDays') => ({
    type: 'number', min: k === 'durationDays' ? 1 : 0, required: true, value: p[k] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, Number(e.target.value)),
  });

  return (
    <form onSubmit={submit} className="border border-neutral-200 rounded-xl bg-white p-4 space-y-4">
      <h2 className="font-medium">{initial ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="sm:col-span-2 text-xs text-neutral-500 space-y-1">Tên sản phẩm
          <input className="input" required value={p.title} onChange={(e) => set('title', e.target.value)} />
        </label>
        <label className="text-xs text-neutral-500 space-y-1">Danh mục
          <input className="input" required value={p.category} onChange={(e) => set('category', e.target.value)} />
        </label>
        <label className="text-xs text-neutral-500 space-y-1">Người cho mượn
          <input className="input" required value={p.owner} onChange={(e) => set('owner', e.target.value)} />
        </label>
        <label className="text-xs text-neutral-500 space-y-1">Giá mượn/ngày (đ)
          <input className="input" {...num('rentalPricePerDay')} />
        </label>
        <label className="text-xs text-neutral-500 space-y-1">Tiền cọc (đ)
          <input className="input" {...num('depositAmount')} />
        </label>
        <label className="text-xs text-neutral-500 space-y-1">Số ngày mượn gợi ý
          <input className="input" {...num('durationDays')} />
        </label>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-neutral-500">Hình sản phẩm (ảnh đầu tiên là ảnh đại diện)</p>
        <div className="flex flex-wrap gap-2">
          {p.images.map((src, i) => (
            <div key={i} className="relative w-20 h-20 group">
              <img src={src} alt={`Ảnh ${i + 1}`} className={`w-20 h-20 rounded-lg object-cover bg-neutral-100 text-[0px] ${i === 0 ? 'ring-2 ring-neutral-900' : ''}`} />
              <div className="absolute inset-x-0 bottom-0 flex justify-between p-1">
                {i > 0 ? (
                  <button type="button" title="Đặt làm ảnh đại diện" onClick={() => makeCover(i)} className="bg-white/90 rounded p-0.5"><Star className="w-3.5 h-3.5" /></button>
                ) : <span />}
                <button type="button" title="Xóa ảnh" aria-label={`Xóa ảnh ${i + 1}`} onClick={() => removeImage(i)} className="bg-white/90 rounded p-0.5 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-20 h-20 rounded-lg border border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-500 text-[11px] gap-1">
            <ImagePlus className="w-5 h-5" /> Tải ảnh
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
        </div>
        <div className="flex gap-2">
          <input className="input" placeholder="Hoặc dán link ảnh (https://...)" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="button" onClick={addUrl} className="text-sm border border-neutral-300 rounded-lg px-3 shrink-0">Thêm</button>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn">Lưu</button>
        <button type="button" onClick={onCancel} className="w-full text-sm border border-neutral-300 rounded-lg">Hủy</button>
      </div>
    </form>
  );
}
