'use client';

import { RoleOnly } from '@/components/AppShell';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export default function CheckoutPage() {
  return (
    <RoleOnly roles={['renter']}>
      <CheckoutForm />
    </RoleOnly>
  );
}
