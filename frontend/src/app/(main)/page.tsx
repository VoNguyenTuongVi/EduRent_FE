'use client';

import { useAuth } from '@/lib/auth';
import Catalog from '@/components/Catalog';
import ProductManager from '@/components/admin/ProductManager';

// Trang chính tùy vai trò: người mượn xem đồ để mượn, người cho thuê và admin quản lý sản phẩm
export default function HomePage() {
  const { user } = useAuth();
  return user?.role === 'renter' ? <Catalog /> : <ProductManager />;
}
