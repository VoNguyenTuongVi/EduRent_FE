'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { RoleOnly } from '@/components/AppShell';
import CartList, { Totals } from '@/components/CartList';

export default function CartPage() {
  const { lines } = useCart();
  return (
    <RoleOnly roles={['renter']}>
      <div className="space-y-5">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Túi đồ</h1>
        {lines.length === 0 ? (
          <p className="text-sm text-neutral-500">Túi đồ đang trống. <Link href="/" className="underline">Chọn đồ để mượn</Link></p>
        ) : (
          <>
            <CartList />
            <Totals />
            <Link href="/checkout" className="btn block text-center">Thanh toán</Link>
          </>
        )}
      </div>
    </RoleOnly>
  );
}
