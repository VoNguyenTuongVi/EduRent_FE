'use client';

// Túi đồ lưu trên trình duyệt, tách riêng theo từng tài khoản.
// Giá ở đây chỉ để hiển thị, khi tạo đơn backend sẽ tự tính lại từ CSDL.
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth';
import { Product } from './types';

export interface CartLine {
  productId: string;
  title: string;
  image: string;
  rentalPricePerDay: number;
  depositAmount: number;
  days: number;
}

interface CartCtx {
  lines: CartLine[];
  rent: number;
  deposit: number;
  total: number;
  has: (id: string) => boolean;
  add: (p: Product) => void;
  setDays: (id: string, days: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const key = user ? `edurent-cart-${user.id}` : null;
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    let saved: CartLine[] = [];
    try { if (key) saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
    setLines(saved);
    setLoadedKey(key);
  }, [key]);

  useEffect(() => {
    if (!key || loadedKey !== key) return;
    try { localStorage.setItem(key, JSON.stringify(lines)); } catch {}
  }, [lines, key, loadedKey]);

  const rent = lines.reduce((s, l) => s + l.rentalPricePerDay * l.days, 0);
  const deposit = lines.reduce((s, l) => s + l.depositAmount, 0);

  const value: CartCtx = {
    lines, rent, deposit, total: rent + deposit,
    has: (id) => lines.some((l) => l.productId === id),
    add: (p) => setLines((ls) => ls.some((l) => l.productId === p.id) ? ls : [...ls, {
      productId: p.id, title: p.title, image: p.images[0], rentalPricePerDay: p.rentalPricePerDay, depositAmount: p.depositAmount, days: p.durationDays,
    }]),
    setDays: (id, days) => setLines((ls) => ls.map((l) => (l.productId === id ? { ...l, days: Math.min(30, Math.max(1, days)) } : l))),
    remove: (id) => setLines((ls) => ls.filter((l) => l.productId !== id)),
    clear: () => setLines([]),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart phải nằm trong CartProvider');
  return c;
}
