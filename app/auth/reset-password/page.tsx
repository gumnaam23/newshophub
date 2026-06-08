// app/auth/reset-password/page.tsx

import { Suspense } from 'react';
import ResetPasswordWrapper from '@/app/components/auth/resetPassword/ResetPasswordWrapper';



export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResetPasswordWrapper />
    </Suspense>
  );
}