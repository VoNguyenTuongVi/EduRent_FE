'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, LogOut, Package, ShoppingBag, Store, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import { ROLE_LABEL, Role } from '@/lib/types';

type NavItem = { href: string; label: string; icon: React.ElementType };

// Mỗi vai trò có thanh điều hướng riêng
const NAV: Record<Role, NavItem[]> = {
  renter: [
    { href: '/', label: 'Mượn đồ', icon: Store },
    { href: '/cart', label: 'Túi đồ', icon: ShoppingBag },
    { href: '/orders', label: 'Đơn của tôi', icon: ClipboardList },
  ],
  lender: [
    { href: '/', label: 'Đồ của tôi', icon: Package },
    { href: '/orders', label: 'Đơn thuê', icon: ClipboardList },
  ],
  admin: [
    { href: '/', label: 'Sản phẩm', icon: Package },
    { href: '/orders', label: 'Đơn hàng', icon: ClipboardList },
    { href: '/users', label: 'Tài khoản', icon: Users },
  ],
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { lines } = useCart();
  const path = usePathname();
  if (!user) return null;

  const items = NAV[user.role];
  const active = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));
  const badge = (href: string) => (href === '/cart' && lines.length > 0 ? lines.length : 0);

  return (
    <>
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight">EduRent</Link>
          <nav className="hidden sm:flex items-center gap-5 text-sm">
            {items.map((it) => (
              <Link key={it.href} href={it.href} className={active(it.href) ? 'font-medium text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}>
                {it.label}{badge(it.href) ? ` (${badge(it.href)})` : ''}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <div className="text-right leading-tight">
              <p className="font-medium truncate max-w-[9rem]">{user.fullName}</p>
              <p className="text-[11px] text-neutral-500">{ROLE_LABEL[user.role]}</p>
            </div>
            <button onClick={logout} aria-label="Đăng xuất" title="Đăng xuất" className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-8">{children}</main>

      {/* Thanh điều hướng dưới cùng trên điện thoại */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-neutral-200 flex pb-[env(safe-area-inset-bottom)]">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link key={it.href} href={it.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] relative ${active(it.href) ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
              <Icon className="w-5 h-5" />
              {it.label}
              {badge(it.href) > 0 && (
                <span className="absolute top-1 left-1/2 ml-2 bg-neutral-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{badge(it.href)}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

// Chỉ cho vai trò được phép xem nội dung trang
export function RoleOnly({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role))
    return <p className="text-sm text-neutral-500">Trang này không dành cho vai trò của bạn. <Link href="/" className="underline">Về trang chính</Link></p>;
  return <>{children}</>;
}
