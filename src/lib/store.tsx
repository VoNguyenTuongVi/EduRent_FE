'use client';

// Kho dữ liệu dùng chung (sản phẩm, tài khoản, phiên đăng nhập, túi đồ).
// Chưa có backend nên lưu vào localStorage của trình duyệt để demo.
import { createContext, useContext, useEffect, useState } from 'react';
import { Product, SEED_PRODUCTS, SEED_USERS, User } from '@/mock/mockData';

export interface CartLine { productId: string; days: number }

interface Data { products: Product[]; users: User[]; session: string | null; cart: CartLine[] }

const KEY = 'edurent-data-v1';
const SEED: Data = { products: SEED_PRODUCTS, users: SEED_USERS, session: null, cart: [] };

interface Store extends Data {
  ready: boolean;
  user: User | null;
  login: (username: string, password: string) => string | null;
  register: (u: Omit<User, 'role'>) => string | null;
  logout: () => void;
  addToCart: (productId: string) => void;
  setDays: (productId: string, days: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Data>(SEED);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setData({ ...SEED, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      alert('Bộ nhớ trình duyệt đã đầy, hãy dùng ảnh nhỏ hơn hoặc xóa bớt ảnh.');
    }
  }, [data, ready]);

  const user = data.users.find((u) => u.username === data.session) ?? null;
  const update = (fn: (d: Data) => Data) => setData((d) => fn(d));

  const store: Store = {
    ...data,
    ready,
    user,
    login: (username, password) => {
      const u = data.users.find((x) => x.username === username.trim());
      if (!u || u.password !== password) return 'Sai tên đăng nhập hoặc mật khẩu';
      update((d) => ({ ...d, session: u.username }));
      return null;
    },
    register: (nu) => {
      if (data.users.some((x) => x.username === nu.username.trim())) return 'Tên đăng nhập đã tồn tại';
      const u: User = { ...nu, username: nu.username.trim(), role: 'user' };
      update((d) => ({ ...d, users: [...d.users, u], session: u.username }));
      return null;
    },
    logout: () => update((d) => ({ ...d, session: null })),
    addToCart: (productId) =>
      update((d) => {
        if (d.cart.some((l) => l.productId === productId)) return d;
        const p = d.products.find((x) => x.id === productId);
        return { ...d, cart: [...d.cart, { productId, days: p?.durationDays ?? 1 }] };
      }),
    setDays: (productId, days) =>
      update((d) => ({ ...d, cart: d.cart.map((l) => (l.productId === productId ? { ...l, days: Math.min(30, Math.max(1, days)) } : l)) })),
    removeFromCart: (productId) => update((d) => ({ ...d, cart: d.cart.filter((l) => l.productId !== productId) })),
    clearCart: () => update((d) => ({ ...d, cart: [] })),
    saveProduct: (p) =>
      update((d) => ({
        ...d,
        products: d.products.some((x) => x.id === p.id) ? d.products.map((x) => (x.id === p.id ? p : x)) : [p, ...d.products],
      })),
    deleteProduct: (id) =>
      update((d) => ({ ...d, products: d.products.filter((x) => x.id !== id), cart: d.cart.filter((l) => l.productId !== id) })),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore phải nằm trong StoreProvider');
  return s;
}

// Ghép túi đồ với thông tin sản phẩm và tính tiền
export function useCartLines() {
  const { cart, products } = useStore();
  const lines = cart
    .map((l) => ({ ...l, product: products.find((p) => p.id === l.productId) }))
    .filter((l): l is CartLine & { product: Product } => !!l.product);
  const rent = lines.reduce((s, l) => s + l.product.rentalPricePerDay * l.days, 0);
  const deposit = lines.reduce((s, l) => s + l.product.depositAmount, 0);
  return { lines, rent, deposit, total: rent + deposit };
}
