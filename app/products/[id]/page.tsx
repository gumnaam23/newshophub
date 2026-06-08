import ProductDetailClient from '@/app/components/products/ProductDetail/ProductDetailClient';
import { Suspense } from 'react';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  // Optional: Fetch product metadata on server for SEO
  // const product = await fetchProduct(params.id);
  
  return {
    title: `Product Details`,
    description: 'View product details',
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductDetailClient productId={id} />
    </Suspense>
  );
}