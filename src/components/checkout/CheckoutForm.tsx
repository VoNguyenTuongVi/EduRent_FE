'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartLines, useStore } from '@/lib/store';
import { METHOD_LABEL, PaymentMethod } from '@/types/payment';
import { newOrderCode, vnd } from '@/lib/format';
import CartList, { Totals } from '@/components/CartList';
import VietQRModal from './VietQRModal';
import AtmPaymentModal from './AtmPaymentModal';
import CardPaymentModal from './CardPaymentModal';
import PayPalModal from './PayPalModal';

const METHODS: { id: PaymentMethod; note: string }[] = [
  { id: 'vietqr', note: 'Quét mã bằng app ngân hàng' },
  { id: 'bank', note: 'Quét QR hoặc thẻ ATM, OTP qua Napas' },
  { id: 'visa', note: 'Thẻ quốc tế' },
  { id: 'paypal', note: 'Chuyển sang trang PayPal để duyệt' },
];

export default function CheckoutForm() {
  const router = useRouter();
  const { user, ready, clearCart } = useStore();
  const { lines, total } = useCartLines();

  const [info, setInfo] = useState({ fullName: '', studentId: '', phone: '', pickupLocation: '' });
  const [method, setMethod] = useState<PaymentMethod>('vietqr');
  const [open, setOpen] = useState<PaymentMethod | null>(null);
  const [orderCode, setOrderCode] = useState('');

  // Đã đăng nhập thì tự điền thông tin người mượn theo tài khoản
  useEffect(() => {
    if (user) setInfo({ fullName: user.fullName, studentId: user.studentId, phone: user.phone, pickupLocation: user.pickupLocation });
  }, [user]);

  if (!ready) return null;

  if (lines.length === 0)
    return <p className="text-sm text-neutral-500">Túi đồ đang trống. <Link href="/" className="underline">Chọn đồ để mượn</Link></p>;

  const field = (k: keyof typeof info) => ({ value: info[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInfo({ ...info, [k]: e.target.value }) });

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderCode(newOrderCode()); // tạo đơn nội bộ, trạng thái "Chờ thanh toán"
    setOpen(method);
  };

  const done = (ref: string) => {
    setOpen(null);
    const q = new URLSearchParams({ order: orderCode, method, amount: String(total), ref, items: lines.map((l) => l.product.title).join(' | ') });
    clearCart();
    router.push(`/checkout/success?${q}`);
  };

  const modal = { onClose: () => setOpen(null), onSuccess: done, amount: total, orderCode };

  return (
    <>
      <form onSubmit={pay} className="space-y-6">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">← Chọn thêm đồ</Link>

        <section className="space-y-3">
          <h2 className="text-sm font-medium">Túi đồ ({lines.length} món)</h2>
          <CartList />
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium">Thông tin người mượn</h2>
            {user ? (
              <span className="text-xs text-neutral-500">Đã tự điền theo tài khoản {user.username}</span>
            ) : (
              <Link href="/login?next=/checkout" className="text-xs underline">Đăng nhập để tự điền</Link>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="input" required placeholder="Họ và tên" {...field('fullName')} />
            <input className="input" required placeholder="MSSV" {...field('studentId')} />
            <input className="input" required placeholder="Số điện thoại" inputMode="tel" {...field('phone')} />
            <input className="input" required placeholder="Điểm hẹn nhận đồ (VD: Sảnh KTX khu A)" {...field('pickupLocation')} />
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-medium">Phương thức thanh toán</h2>
          {METHODS.map((m) => (
            <label key={m.id} className={`flex items-center gap-3 border rounded-lg px-3 py-3 bg-white cursor-pointer ${method === m.id ? 'border-neutral-900' : 'border-neutral-200'}`}>
              <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-neutral-900" />
              <span className="text-sm font-medium">{METHOD_LABEL[m.id]}</span>
              <span className="text-xs text-neutral-500 ml-auto text-right">{m.note}</span>
            </label>
          ))}
        </section>

        <Totals />
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
