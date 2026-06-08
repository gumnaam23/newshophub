'use client';

import { Shield, Lock } from 'lucide-react';

interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  carrier: string;
  estimatedDays: string;
}

interface PaymentOrderSummaryProps {
  cartSummary: CartSummary;
  shippingMethod: ShippingMethod | null;
}

export default function PaymentOrderSummary({
  cartSummary,
  shippingMethod,
}: PaymentOrderSummaryProps) {
  const total = cartSummary.total;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sticky top-20">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>${cartSummary.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Shipping</span>
          <span>
            {cartSummary.shipping === 0
              ? 'Free'
              : `$${cartSummary.shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Tax (10%)</span>
          <span>${cartSummary.tax.toFixed(2)}</span>
        </div>
        {shippingMethod && (
          <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
            <span>Shipping Method</span>
            <span>{shippingMethod.name}</span>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Shield className="w-4 h-4 text-green-600" />
          <span>Purchase Protection Guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
          <Lock className="w-4 h-4 text-green-600" />
          <span>Secure Payment</span>
        </div>
      </div>
    </div>
  );
}