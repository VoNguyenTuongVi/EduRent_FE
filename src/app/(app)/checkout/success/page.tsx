import { Suspense } from 'react';
import Receipt from '@/components/success/Receipt';

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Đang tải...</p>}>
      <Receipt />
    </Suspense>
  );
}
