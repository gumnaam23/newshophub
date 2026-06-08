'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

export default function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {`Looks like you haven't added any items to your cart yet.`}
      </p>
      <Link href="/products">
        <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}