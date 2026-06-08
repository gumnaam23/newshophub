import { Suspense } from 'react';
import ProductsClient from '../components/products/ProductsClient';

// Server component - metadata is supported
export const metadata = {
  title: 'All Products',
  description: 'Browse our collection of high-quality products',
};

// Server component can also fetch initial data if needed
export default async function ProductsPage() {
  // Optional: Pre-fetch initial products on server for SEO
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsClient />
    </Suspense>
  );
}