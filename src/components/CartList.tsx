'use client';

import { Minus, Plus, X } from 'lucide-react';
import { useCartLines, useStore } from '@/lib/store';
import { vnd } from '@/lib/format';

// Danh sách món trong túi đồ, chỉnh số ngày từng món
export default function CartList() {
  const { setDays, removeFromCart } = useStore();
  const { lines } = useCartLines();

  return (
    <ul className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl bg-white">
      {lines.map(({ product: p, days }) => (
        <li key={p.id} className="flex items-center gap-3 p-3">
          <img src={p.images[0]} alt={p.title} className="w-14 h-14 rounded-lg object-cover bg-neutral-100 text-[0px] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{p.title}</p>
            <p className="text-xs text-neutral-500">{vnd(p.rentalPricePerDay)}/ngày · cọc {vnd(p.depositAmount)}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <button type="button" aria-label="Giảm ngày" onClick={() => setDays(p.id, days - 1)} className="p-0.5 rounded border border-neutral-200"><Minus className="w-3 h-3" /></button>
              <span className="text-xs w-12 text-center">{days} ngày</span>
              <button type="button" aria-label="Tăng ngày" onClick={() => setDays(p.id, days + 1)} className="p-0.5 rounded border border-neutral-200"><Plus className="w-3 h-3" /></button>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-medium">{vnd(p.rentalPricePerDay * days + p.depositAmount)}</p>
            <button type="button" onClick={() => removeFromCart(p.id)} className="text-xs text-neutral-400 hover:text-red-600 inline-flex items-center gap-0.5 mt-1">
              <X className="w-3 h-3" /> Bỏ
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Totals() {
  const { rent, deposit, total, lines } = useCartLines();
  return (
    <section className="border-t border-neutral-200 pt-4 space-y-1 text-sm">
      <div className="flex justify-between"><span className="text-neutral-500">Tiền mượn ({lines.length} món)</span><span>{vnd(rent)}</span></div>
      <div className="flex justify-between"><span className="text-neutral-500">Tiền cọc (hoàn lại khi trả đồ)</span><span>{vnd(deposit)}</span></div>
      <div className="flex justify-between font-semibold text-base pt-2"><span>Tổng</span><span>{vnd(total)}</span></div>
    </section>
  );
}
