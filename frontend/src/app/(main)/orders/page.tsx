'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Order } from '@/lib/types';
import { METHOD_LABEL, PaymentMethod } from '@/types/payment';
import { vnd } from '@/lib/format';

const TITLE = { renter: 'Đơn của tôi', lender: 'Đơn thuê đồ của tôi', admin: 'Tất cả đơn hàng' };

// Backend đã lọc sẵn: người mượn thấy đơn của mình, người cho thuê thấy phần đơn có đồ của mình, admin thấy hết
export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => { api<Order[]>('/orders').then(setOrders).catch((e) => setErr(e.message)); }, []);
  if (!user) return null;

  return (
    <div className="space-y-5">
      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{TITLE[user.role]}</h1>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {orders?.length === 0 && <p className="text-sm text-neutral-500">Chưa có đơn nào.</p>}

      <div className="space-y-3">
        {orders?.map((o) => (
          <div key={o.id} className="bg-white border border-neutral-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-medium">{o.code}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {o.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
              </span>
            </div>
            <ul className="text-sm space-y-0.5">
              {o.items.map((i) => (
                <li key={i.productId} className="flex justify-between gap-3">
                  <span className="truncate">{i.title} <span className="text-neutral-500">· {i.days} ngày</span></span>
                  <span className="shrink-0">{vnd(i.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-neutral-500 border-t border-neutral-100 pt-2">
              {user.role !== 'renter' && <span>Người mượn: {o.borrower.fullName} · {o.borrower.phone}</span>}
              <span>Nhận tại: {o.borrower.pickupLocation}</span>
              <span>{METHOD_LABEL[o.method as PaymentMethod] ?? o.method} · {new Date(o.createdAt).toLocaleString('vi-VN')}</span>
              <span className="font-semibold text-neutral-900 text-sm">{user.role === 'lender' ? 'Phần của bạn: ' : 'Tổng: '}{vnd(o.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
