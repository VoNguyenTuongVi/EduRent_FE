'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Order } from '@/lib/types';
import { METHOD_LABEL, PaymentMethod } from '@/types/payment';
import { vnd } from '@/lib/format';

export default function Receipt() {
  const id = useSearchParams().get('id');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    api<Order[]>('/orders').then((list) => setOrder(list.find((o) => o.id === id) ?? null));
  }, [id]);

  if (!order) return <p className="text-sm text-neutral-500 text-center">Đang tải...</p>;

  const rows: [string, string][] = [
    ['Mã đơn', order.code],
    ['Đồ mượn', order.items.map((i) => `${i.title} (${i.days} ngày)`).join('\n')],
    ['Phương thức', METHOD_LABEL[order.method as PaymentMethod] ?? order.method],
    ['Mã giao dịch', order.paymentRef ?? '—'],
    ['Số tiền', vnd(order.total)],
  ];

  return (
    <div className="max-w-sm mx-auto text-center space-y-5 py-4">
      <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600" />
      <div>
        <h1 className="text-xl font-semibold">Thanh toán thành công</h1>
        <p className="text-sm text-neutral-500 mt-1">Người cho thuê sẽ liên hệ để hẹn giờ giao đồ.</p>
      </div>
      <div className="text-left border border-neutral-200 rounded-lg bg-white divide-y divide-neutral-100">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
            <span className="text-neutral-500 shrink-0">{k}</span>
            <span className="font-medium text-right break-words whitespace-pre-line">{v}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Link href="/orders" className="text-sm border border-neutral-300 rounded-lg py-3">Xem đơn</Link>
        <Link href="/" className="btn">Mượn tiếp</Link>
      </div>
    </div>
  );
}
