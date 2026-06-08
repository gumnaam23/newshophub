// app/auth/reset-password/page.tsx

import ConfirmationWrapper from '@/app/components/cart/checkout/confirmation/ConfirmationWrapper';
import { Suspense } from 'react';



export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ConfirmationWrapper />
    </Suspense>
  );
}