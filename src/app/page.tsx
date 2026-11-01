'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { vnd } from '@/lib/format';

export default function HomePage() {
  const { products, cart, addToCart, ready } = useStore();
  const router = useRouter();
  const [toast, setToast] = useState('');

  if (!ready) return null;

  const add = (id: string, title: string) => {
    addToCart(id);
    setToast(`Đã thêm "${title}" vào túi đồ`);
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Chọn đồ cần mượn</h1>
        <p className="text-sm text-neutral-500 mt-1">Thêm nhiều món vào túi đồ rồi thanh toán một lượt. Cọc được hoàn sau khi trả đồ.</p>
      </div>

      {products.length === 0 && <p className="text-sm text-neutral-500">Chưa có sản phẩm nào.</p>}

      <ul className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl bg-white">
        {products.map((item) => {
          const inCart = cart.some((l) => l.productId === item.id);
          return (
            <li key={item.id} className="flex items-center gap-4 p-4">
              <img src={item.images[0]} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-neutral-100 text-[0px] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{item.category} · {item.owner}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{vnd(item.rentalPricePerDay)}/ngày · cọc {vnd(item.depositAmount)}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0 w-28">
                <button onClick={() => add(item.id, item.title)} disabled={inCart}
                  className="text-xs border border-neutral-300 rounded-lg py-1.5 disabled:text-neutral-400 disabled:border-neutral-200">
                  {inCart ? 'Đã trong túi' : 'Thêm vào túi'}
                </button>
                <button onClick={() => { addToCart(item.id); router.push('/checkout'); }} className="text-xs bg-neutral-900 text-white rounded-lg py-1.5">
                  Mượn ngay
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg">{toast}</div>}
    </div>
  );
}
