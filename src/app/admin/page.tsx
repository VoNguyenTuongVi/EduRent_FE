'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Product } from '@/mock/mockData';
import { vnd } from '@/lib/format';
import ProductForm from '@/components/admin/ProductForm';

export default function AdminPage() {
  const { user, ready, products, saveProduct, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Product | 'new' | null>(null);

  if (!ready) return null;

  if (user?.role !== 'admin')
    return <p className="text-sm text-neutral-500">Trang này chỉ dành cho quản trị viên. <Link href="/login?next=/admin" className="underline">Đăng nhập bằng tài khoản admin</Link></p>;

  const remove = (p: Product) => {
    if (confirm(`Xóa "${p.title}"?`)) deleteProduct(p.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Quản lý sản phẩm</h1>
        {!editing && (
          <button onClick={() => setEditing('new')} className="text-sm bg-neutral-900 text-white rounded-lg px-3 py-2 inline-flex items-center gap-1">
            <Plus className="w-4 h-4" /> Thêm sản phẩm
          </button>
        )}
      </div>

      {editing && (
        <ProductForm
          key={editing === 'new' ? 'new' : editing.id}
          initial={editing === 'new' ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSave={(p) => { saveProduct(p); setEditing(null); }}
        />
      )}

      <ul className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl bg-white">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-3">
            <img src={p.images[0]} alt={p.title} className="w-14 h-14 rounded-lg object-cover bg-neutral-100 text-[0px] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{p.title}</p>
              <p className="text-xs text-neutral-500">{p.category} · {vnd(p.rentalPricePerDay)}/ngày · cọc {vnd(p.depositAmount)} · {p.images.length} ảnh</p>
            </div>
            <button onClick={() => setEditing(p)} aria-label={`Sửa ${p.title}`} className="p-2 rounded-lg hover:bg-neutral-100"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => remove(p)} aria-label={`Xóa ${p.title}`} className="p-2 rounded-lg hover:bg-neutral-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
          </li>
        ))}
        {products.length === 0 && <li className="p-4 text-sm text-neutral-500">Chưa có sản phẩm nào.</li>}
      </ul>
    </div>
  );
}
