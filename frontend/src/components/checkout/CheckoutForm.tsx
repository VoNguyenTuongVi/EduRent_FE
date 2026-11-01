'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import { post } from '@/lib/api';
import { Order } from '@/lib/types';
import { METHOD_LABEL, PaymentMethod } from '@/types/payment';
import { vnd } from '@/lib/format';
import CartList, { Totals } from '@/components/CartList';
import VietQRModal from './VietQRModal';
import AtmPaymentModal from './AtmPaymentModal';
import CardPaymentModal from './CardPaymentModal';
import PayPalModal from './PayPalModal';

const METHODS: { id: PaymentMethod; note: string }[] = [
  { id: 'vietqr', note: 'Quét mã bằng app ngân hàng' },
  { id: 'bank', note: 'Quét QR hoặc thẻ ATM' },
  { id: 'visa', note: 'Thẻ quốc tế' },
  { id: 'paypal', note: 'Chuyển sang PayPal' },
];

export default function CheckoutForm() {
  const router = useRouter();
  const { user } = useAuth();
  const cart = useCart();

  const [info, setInfo] = useState({ fullName: '', studentId: '', phone: '', pickupLocation: '' });
  const [method, setMethod] = useState<PaymentMethod>('vietqr');
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // Tự điền thông tin người mượn theo tài khoản đang đăng nhập
  useEffect(() => {
    if (user) setInfo({ fullName: user.fullName, studentId: user.studentId, phone: user.phone, pickupLocation: user.pickupLocation });
  }, [user]);

  if (cart.lines.length === 0)
    return <p className="text-sm text-neutral-500">Túi đồ đang trống. <Link href="/" className="underline">Chọn đồ để mượn</Link></p>;

  const field = (k: keyof typeof info) => ({ value: info[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInfo({ ...info, [k]: e.target.value }) });

  // Bước 1: tạo đơn "Chờ thanh toán" trên backend, backend tự tính lại tổng tiền
  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const o = await post<Order>('/orders', {
        method, borrower: info, items: cart.lines.map((l) => ({ productId: l.productId, days: l.days })),
      });
      setOrder(o);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  // Bước 2: cổng thanh toán báo thành công thì cập nhật đơn sang "Đã thanh toán"
  const done = async (ref: string) => {
    if (!order) return;
    try {
      await post(`/orders/${order.id}/pay`, { ref });
      cart.clear();
      router.push(`/checkout/success?id=${order.id}`);
    } catch (e) {
      setErr((e as Error).message);
      setOrder(null);
    }
  };

  const modal = order && { onClose: () => setOrder(null), onSuccess: done, amount: order.total, orderCode: order.code, orderId: order.id };

  return (
    <>
      <form onSubmit={pay} className="space-y-6">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">← Chọn thêm đồ</Link>

        <section className="space-y-3">
          <h2 className="text-sm font-medium">Túi đồ ({cart.lines.length} món)</h2>
          <CartList />
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-medium">Thông tin người mượn</h2>
            <span className="text-xs text-neutral-500">Tự điền theo tài khoản {user?.username}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="input" required placeholder="Họ và tên" {...field('fullName')} />
            <input className="input" required placeholder="MSSV" {...field('studentId')} />
            <input className="input" required placeholder="Số điện thoại" inputMode="tel" {...field('phone')} />
            <input className="input" required placeholder="Điểm hẹn nhận đồ" {...field('pickupLocation')} />
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
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Đang tạo đơn...' : `Thanh toán ${vnd(cart.total)}`}</button>
      </form>

      {/* Modal đặt ngoài form để tránh form lồng nhau */}
      {modal && (
        <>
          <VietQRModal isOpen={method === 'vietqr'} {...modal} />
          <AtmPaymentModal isOpen={method === 'bank'} {...modal} />
          <CardPaymentModal isOpen={method === 'visa'} {...modal} />
          <PayPalModal isOpen={method === 'paypal'} {...modal} />
        </>
      )}
    </>
  );
}
