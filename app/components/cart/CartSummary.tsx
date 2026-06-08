'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CreditCard, Shield, RefreshCw, Truck, Gift } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import CouponInput from './CouponInput';

interface CartSummaryProps {
  summary: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
    itemCount: number;
    totalQuantity: number;
  };
  appliedCoupon: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    discount: number;
    description: string;
  } | null;
  onRemoveCoupon: () => void;
  onApplyCoupon: (code: string) => Promise<void>;
  isApplyingCoupon: boolean;
  couponError: string;
  couponSuccess: string;
}

export default function CartSummary({
  summary,
  appliedCoupon,
  onRemoveCoupon,
  onApplyCoupon,
  isApplyingCoupon,
  couponError,
  couponSuccess
}: CartSummaryProps) {
  const finalTotal = summary.total;
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = freeShippingThreshold - summary.subtotal;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sticky top-20"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Order Summary
      </h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>${summary.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Shipping</span>
          <span>{summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Tax (10%)</span>
          <span>${summary.tax.toFixed(2)}</span>
        </div>
        {summary.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${summary.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
          {remainingForFreeShipping > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Add ${remainingForFreeShipping.toFixed(2)} more for free shipping
            </p>
          )}
          {summary.shipping === 0 && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Free shipping applied
            </p>
          )}
        </div>
      </div>
      
      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-400">
                  {appliedCoupon.code}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">
                  {appliedCoupon.type === 'percentage' 
                    ? `${appliedCoupon.value}% off` 
                    : `$${appliedCoupon.value} off`}
                </p>
              </div>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-red-500 hover:text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}
      
      {/* Coupon Code Input */}
      {!appliedCoupon && (
        <div className="mb-6">
          <CouponInput
            onApplyCoupon={onApplyCoupon}
            isLoading={isApplyingCoupon}
            error={couponError}
            success={couponSuccess}
          />
        </div>
      )}
      
      {/* Checkout Button */}
      <Link href="/cart/checkout">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<CreditCard className="w-4 h-4" />}
        >
          Proceed to Checkout
        </Button>
      </Link>
      
      {/* Payment Guarantees */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Secure payment guaranteed</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <RefreshCw className="w-4 h-4" />
          <span>30-day return policy</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Truck className="w-4 h-4" />
          <span>Free shipping on orders over $50</span>
        </div>
      </div>
    </motion.div>
  );
}