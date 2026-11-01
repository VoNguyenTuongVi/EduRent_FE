'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Minus, Plus } from 'lucide-react';
import { MOCK_ITEMS } from '@/mock/mockData';
import { METHOD_LABEL, PaymentMethod } from '@/types/payment';
import { newOrderCode, vnd } from '@/lib/format';
import VietQRModal from './VietQRModal';
import AtmPaymentModal from './AtmPaymentModal';
import CardPaymentModal from './CardPaymentModal';
import PayPalModal from './PayPalModal';

const METHODS: { id: PaymentMethod; note: string }[] = [
  { id: 'vietqr', note: 'Quét mã bằng app ngân hàng' },
  { id: 'bank', note: 'Thẻ ATM nội địa, OTP qua Napas' },
  { id: 'visa', note: 'Thẻ quốc tế' },
  { id: 'paypal', note: 'Chuyển sang trang PayPal để duyệt' },
];

export default function CheckoutForm() {
  const router = useRouter();
  const params = useSearchParams();
  const item = MOCK_ITEMS.find((i) => i.id === params.get('id')) ?? MOCK_ITEMS[0];

  const [days, setDays] = useState(item.durationDays);
  const [method, setMethod] = useState<PaymentMethod>('vietqr');
  const [open, setOpen] = useState<PaymentMethod | null>(null);
  const [orderCode, setOrderCode] = useState('');

  const rent = item.rentalPricePerDay * days;
  const total = rent + item.depositAmount;

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderCode(newOrderCode()); // B3: tạo đơn nội bộ, trạng thái "Chờ thanh toán"
    setOpen(method);
  };

  const done = (ref: string) => {
    setOpen(null);
    const q = new URLSearchParams({ order: orderCode, method, amount: String(total), ref, item: item.title });
    router.push(`/checkout/success?${q}`);
  };

  const modal = { onClose: () => setOpen(null), onSuccess: done, amount: total, orderCode };

  return (
    <>
    <form onSubmit={pay} className="space-y-6">
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">← Chọn đồ khác</Link>

      <section className="flex gap-4 items-center">
        <img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded-lg object-cover bg-neutral-100 text-[0px]" />
        <div>
          <h1 className="font-semibold">{item.title}</h1>
          <p className="text-sm text-neutral-500">{vnd(item.rentalPricePerDay)}/ngày · {item.owner}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Thông tin người mượn</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" required placeholder="Họ và tên" />
          <input className="input" required placeholder="MSSV" />
          <input className="input sm:col-span-2" required placeholder="Điểm hẹn nhận đồ (VD: Sảnh KTX khu A)" />
        </div>
        <div className="flex items-center justify-between border border-neutral-200 rounded-lg px-3 py-2 bg-white">
          <span className="text-sm">Số ngày mượn</span>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Giảm" onClick={() => setDays((d) => Math.max(1, d - 1))} className="p-1 rounded border border-neutral-200"><Minus className="w-3.5 h-3.5" /></button>
            <span className="w-6 text-center text-sm font-medium">{days}</span>
            <button type="button" aria-label="Tăng" onClick={() => setDays((d) => Math.min(30, d + 1))} className="p-1 rounded border border-neutral-200"><Plus className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Phương thức thanh toán</h2>
        {METHODS.map((m) => (
          <label key={m.id} className={`flex items-center gap-3 border rounded-lg px-3 py-3 bg-white cursor-pointer ${method === m.id ? 'border-neutral-900' : 'border-neutral-200'}`}>
            <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-neutral-900" />
            <span className="text-sm font-medium">{METHOD_LABEL[m.id]}</span>
            <span className="text-xs text-neutral-500 ml-auto">{m.note}</span>
          </label>
        ))}
      </section>

      <section className="border-t border-neutral-200 pt-4 space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-neutral-500">Tiền mượn ({days} ngày)</span><span>{vnd(rent)}</span></div>
        <div className="flex justify-between"><span className="text-neutral-500">Tiền cọc (hoàn lại khi trả đồ)</span><span>{vnd(item.depositAmount)}</span></div>
        <div className="flex justify-between font-semibold text-base pt-2"><span>Tổng</span><span>{vnd(total)}</span></div>
      </section>

      <button className="btn">Thanh toán {vnd(total)}</button>
    </form>

    {/* Modal đặt ngoài form để tránh form lồng nhau */}
      <VietQRModal isOpen={open === 'vietqr'} {...modal} />
      <AtmPaymentModal isOpen={open === 'bank'} {...modal} />
      <CardPaymentModal isOpen={open === 'visa'} {...modal} />
      <PayPalModal isOpen={open === 'paypal'} {...modal} />
    </>
  );
}
