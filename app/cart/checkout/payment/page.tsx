import PaymentClient from '@/app/components/cart/checkout/payment/PaymentClient';
import { Suspense } from 'react';

export const metadata = {
  title: 'Payment - Checkout',
  description: 'Complete your payment securely',
};

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading payment...
        </div>
      }
    >
      <PaymentClient />
    </Suspense>
  );
}