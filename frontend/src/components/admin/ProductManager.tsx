'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api, del } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Product } from '@/lib/types';
import { vnd } from '@/lib/format';
import ProductForm from './ProductForm';

// Người cho thuê: backend chỉ trả về sản phẩm của chính họ. Admin: thấy và sửa được tất cả.
export default function ProductManager() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [err, setErr] = useState('');

  const load = useCallback(() => api<Product[]>('/products').then(setProducts).catch((e) => setErr(e.message)), []);
  useEffect(() => { load(); }, [load]);

  const remove = async (p: Product) => {
    if (!confirm(`Xóa "${p.title}"?`)) return;
    try { await del(`/products/${p.id}`); load(); } catch (e) { setErr((e as Error).message); }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{isAdmin ? 'Tất cả sản phẩm' : 'Đồ cho thuê của tôi'}</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{products?.length ?? 0} sản phẩm</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing('new')} className="text-sm bg-neutral-900 text-white rounded-lg px-3 py-2 inline-flex items-center gap-1 shrink-0">
            <Plus className="w-4 h-4" /> Thêm
          </button>
        )}
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      {editing && (
        <ProductForm
          key={editing === 'new' ? 'new' : editing.id}
          initial={editing === 'new' ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}

      <ul className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl bg-white">
        {products?.map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-3">
            <img src={p.images[0]} alt={p.title} className="w-14 h-14 rounded-lg object-cover bg-neutral-100 text-[0px] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-2">{p.title}</p>
              <p className="text-xs text-neutral-500 truncate">
                {isAdmin && <>{p.ownerName} · </>}{vnd(p.rentalPricePerDay)}/ngày · cọc {vnd(p.depositAmount)} · {p.images.length} ảnh
              </p>
            </div>
            <button onClick={() => { setEditing(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label={`Sửa ${p.title}`} className="p-2 rounded-lg hover:bg-neutral-100"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => remove(p)} aria-label={`Xóa ${p.title}`} className="p-2 rounded-lg hover:bg-neutral-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
          </li>
        ))}
        {products?.length === 0 && <li className="p-4 text-sm text-neutral-500">Chưa có sản phẩm nào. Bấm “Thêm” để đăng món đầu tiên.</li>}
      </ul>
    </div>
  );
}
