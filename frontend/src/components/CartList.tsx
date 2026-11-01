'use client';

import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { vnd } from '@/lib/format';

export default function CartList() {
  const { lines, setDays, remove } = useCart();
  return (
    <ul className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl bg-white">
      {lines.map((l) => (
        <li key={l.productId} className="flex items-center gap-3 p-3">
          <img src={l.image} alt={l.title} className="w-14 h-14 rounded-lg object-cover bg-neutral-100 text-[0px] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium line-clamp-2">{l.title}</p>
            <p className="text-xs text-neutral-500">{vnd(l.rentalPricePerDay)}/ngày · cọc {vnd(l.depositAmount)}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <button type="button" aria-label="Giảm ngày" onClick={() => setDays(l.productId, l.days - 1)} className="p-1 rounded border border-neutral-200"><Minus className="w-3 h-3" /></button>
              <span className="text-xs w-12 text-center">{l.days} ngày</span>
              <button type="button" aria-label="Tăng ngày" onClick={() => setDays(l.productId, l.days + 1)} className="p-1 rounded border border-neutral-200"><Plus className="w-3 h-3" /></button>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-medium">{vnd(l.rentalPricePerDay * l.days + l.depositAmount)}</p>
            <button type="button" onClick={() => remove(l.productId)} className="text-xs text-neutral-400 hover:text-red-600 inline-flex items-center gap-0.5 mt-1">
              <X className="w-3 h-3" /> Bỏ
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Totals() {
  const { rent, deposit, total, lines } = useCart();
  return (
    <section className="border-t border-neutral-200 pt-4 space-y-1 text-sm">
      <div className="flex justify-between"><span className="text-neutral-500">Tiền mượn ({lines.length} món)</span><span>{vnd(rent)}</span></div>
      <div className="flex justify-between"><span className="text-neutral-500">Tiền cọc (hoàn lại khi trả đồ)</span><span>{vnd(deposit)}</span></div>
      <div className="flex justify-between font-semibold text-base pt-2"><span>Tổng</span><span>{vnd(total)}</span></div>
    </section>
  );
}
