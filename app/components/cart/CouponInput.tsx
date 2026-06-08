'use client';

import { useState } from 'react';
import { Tag } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface CouponInputProps {
  onApplyCoupon: (code: string) => Promise<void>;
  isLoading: boolean;
  error: string;
  success: string;
}

export default function CouponInput({ onApplyCoupon, isLoading, error, success }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('');

  const handleApply = () => {
    if (!couponCode.trim()) return;
    onApplyCoupon(couponCode.toUpperCase());
    setCouponCode('');
  };

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Enter coupon code"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={handleApply}
          disabled={isLoading || !couponCode.trim()}
          isLoading={isLoading}
        >
          Apply
        </Button>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}
      {success && (
        <p className="text-green-500 text-xs mt-2">{success}</p>
      )}
    </div>
  );
}