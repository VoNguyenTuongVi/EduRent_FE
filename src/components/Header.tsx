'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Header() {
  const { user, cart, logout, ready } = useStore();
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="font-semibold tracking-tight mr-auto">EduRent</Link>
        {ready && (
          <>
            {user?.role === 'admin' && <Link href="/admin" className="text-sm text-neutral-600 hover:text-neutral-900">Quản trị</Link>}
            <Link href="/cart" className="relative text-neutral-700 hover:text-neutral-900" aria-label="Túi đồ">
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-neutral-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{cart.length}</span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-neutral-600 hidden sm:inline">{user.fullName}</span>
                <button onClick={logout} className="text-neutral-500 hover:text-neutral-900">Đăng xuất</button>
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium">Đăng nhập</Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}
