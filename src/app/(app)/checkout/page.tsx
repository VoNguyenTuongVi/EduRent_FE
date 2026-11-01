import { Suspense } from 'react';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Đang tải...</p>}>
      <CheckoutForm />
    </Suspense>
  );
}
