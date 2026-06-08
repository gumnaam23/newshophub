'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import ProductCard from './ProductCard';
import ProductListItem from './ProductListItem';
import { IProduct } from '@/models/Product';

interface ProductListProps {
  products: IProduct[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  onAddToCart: (productId: string) => void;
  addingToCartId: string | null;
  onClearFilters: () => void;
}

export default function ProductList({
  products,
  loading,
  viewMode,
  onAddToCart,
  addingToCartId,
  onClearFilters,
}: ProductListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or search terms</p>
        <Button variant="primary" onClick={onClearFilters}>Clear All Filters</Button>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
      {products.map((product, idx) =>
        viewMode === 'grid' ? (
          <ProductCard
            key={product._id}
            product={product}
            index={idx}
            onAddToCart={onAddToCart}
            isAddingToCart={addingToCartId === product._id}
          />
        ) : (
          <ProductListItem
            key={product._id}
            product={product}
            index={idx}
            onAddToCart={onAddToCart}
            isAddingToCart={addingToCartId === product._id}
          />
        )
      )}
    </div>
  );
}