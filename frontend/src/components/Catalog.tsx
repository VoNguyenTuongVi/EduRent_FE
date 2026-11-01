'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { Product } from '@/lib/types';
import { vnd } from '@/lib/format';

export default function Catalog() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [toast, setToast] = useState('');
  const cart = useCart();
  const router = useRouter();

  useEffect(() => { api<Product[]>('/products').then(setProducts).catch((e) => setErr(e.message)); }, []);

  const add = (p: Product) => {
    cart.add(p);
    setToast('Đã thêm vào túi đồ');
    setTimeout(() => setToast(''), 1500);
  };

  const list = (products ?? []).filter((p) => (p.title + p.category).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Chọn đồ cần mượn</h1>
        <p className="text-sm text-neutral-500 mt-1">Thêm nhiều món vào túi đồ rồi thanh toán một lượt.</p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
        <input className="input pl-9" placeholder="Tìm máy ảnh, máy tính, mic..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}
      {products && list.length === 0 && <p className="text-sm text-neutral-500">Không có sản phẩm phù hợp.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {list.map((p) => {
          const inCart = cart.has(p.id);
          return (
            <div key={p.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col">
              <img src={p.images[0]} alt={p.title} className="aspect-[4/3] w-full object-cover bg-neutral-100 text-[0px]" />
              <div className="p-3 flex flex-col flex-1 gap-1">
                <p className="text-sm font-medium line-clamp-2">{p.title}</p>
                <p className="text-xs text-neutral-500 truncate">{p.ownerName}</p>
                <p className="text-sm font-semibold mt-auto pt-1">{vnd(p.rentalPricePerDay)}<span className="text-xs font-normal text-neutral-500">/ngày</span></p>
                <p className="text-xs text-neutral-500">Cọc {vnd(p.depositAmount)}</p>
                <div className="grid grid-cols-2 gap-1.5 pt-2">
                  <button onClick={() => add(p)} disabled={inCart}
                    className="text-xs border border-neutral-300 rounded-lg py-2 disabled:text-neutral-400 disabled:border-neutral-200">
                    {inCart ? 'Đã thêm' : '+ Túi'}
                  </button>
                  <button onClick={() => { cart.add(p); router.push('/checkout'); }} className="text-xs bg-neutral-900 text-white rounded-lg py-2">Mượn ngay</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {toast && <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg z-40">{toast}</div>}
    </div>
  );
}
