import CheckoutClient from '@/app/components/cart/checkout/CheckoutClient';
import { Suspense } from 'react';

export const metadata = {
  title: 'Checkout - Shipping Address',
  description: 'Select or add shipping address for your order',
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}