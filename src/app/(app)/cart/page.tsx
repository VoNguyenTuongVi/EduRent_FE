'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import CartList, { Totals } from '@/components/CartList';

export default function CartPage() {
  const { cart, ready } = useStore();
  if (!ready) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Túi đồ</h1>
      {cart.length === 0 ? (
        <p className="text-sm text-neutral-500">Túi đồ đang trống. <Link href="/" className="underline">Chọn đồ để mượn</Link></p>
      ) : (
        <>
          <CartList />
          <Totals />
          <Link href="/checkout" className="btn block text-center">Thanh toán</Link>
        </>
      )}
    </div>
  );
}
