import { Suspense } from 'react';
import CartClient from '../components/cart/CartClient';

export const metadata = {
  title: 'Shopping Cart',
  description: 'View and manage your shopping cart items',
};

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading cart...</div>}>
      <CartClient />
    </Suspense>
  );
}