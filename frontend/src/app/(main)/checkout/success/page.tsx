import { Suspense } from 'react';
import Receipt from '@/components/Receipt';

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <Receipt />
    </Suspense>
  );
}
