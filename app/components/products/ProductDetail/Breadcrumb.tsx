'use client';

import Link from 'next/link';

interface BreadcrumbProps {
  category: string;
  productName: string;
}

export default function Breadcrumb({ category, productName }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6 flex-wrap">
      <Link href="/" className="hover:text-blue-600">Home</Link>
      <span>/</span>
      <Link href="/products" className="hover:text-blue-600">Products</Link>
      <span>/</span>
      <Link href={`/products?category=${category}`} className="hover:text-blue-600">
        {category}
      </Link>
      <span>/</span>
      <span className="text-gray-900 dark:text-white">{productName}</span>
    </div>
  );
}