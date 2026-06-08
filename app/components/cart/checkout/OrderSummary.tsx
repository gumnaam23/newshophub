'use client';

import { Gift } from 'lucide-react';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount: number;
  description: string;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  summary: CartSummary;
  appliedCoupon: AppliedCoupon | null;
}

export default function OrderSummary({ cartItems, summary, appliedCoupon }: OrderSummaryProps) {
  const finalTotal = summary.total;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sticky top-20">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Order Summary
      </h3>
      
      <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                {item.name}
              </p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">
              ${item.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
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
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount ({appliedCoupon?.code})</span>
            <span>-${summary.discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {appliedCoupon && summary.discount > 0 && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                Coupon Applied: {appliedCoupon.code}
              </p>
              <p className="text-xs text-green-600 dark:text-green-500">
                You saved ${appliedCoupon.discount.toFixed(2)} on this order
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}