'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { METHOD_LABEL, PaymentMethod } from '@/types/payment';
import { vnd } from '@/lib/format';

export default function Receipt() {
  const p = useSearchParams();
  const method = (p.get('method') ?? 'vietqr') as PaymentMethod;
  const rows: [string, string][] = [
    ['Đồ mượn', p.get('item') ?? '—'],
    ['Mã đơn', p.get('order') ?? '—'],
    ['Phương thức', METHOD_LABEL[method] ?? method],
    ['Mã giao dịch', p.get('ref') ?? '—'],
    ['Số tiền', vnd(Number(p.get('amount') ?? 0))],
  ];

  return (
    <div className="max-w-sm mx-auto text-center space-y-5 py-6">
      <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600" />
      <div>
        <h1 className="text-xl font-semibold">Thanh toán thành công</h1>
        <p className="text-sm text-neutral-500 mt-1">Người cho mượn sẽ liên hệ để hẹn giờ giao đồ.</p>
      </div>
      <div className="text-left border border-neutral-200 rounded-lg bg-white divide-y divide-neutral-100">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
            <span className="text-neutral-500">{k}</span>
            <span className="font-medium text-right break-all">{v}</span>
          </div>
        ))}
      </div>
      <Link href="/" className="btn inline-block">Về trang chủ</Link>
    </div>
  );
}
