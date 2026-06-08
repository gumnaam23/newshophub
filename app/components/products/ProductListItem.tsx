'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Truck, Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { IProduct } from '@/models/Product';

interface ProductListItemProps {
  product: IProduct;
  index: number;
  onAddToCart: (productId: string) => void;
  isAddingToCart: boolean;
}

export default function ProductListItem({ product, index, onAddToCart, isAddingToCart }: ProductListItemProps) {
  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <Link href={`/products/${product._id}`} className="md:w-64">
          <div className="relative aspect-square md:aspect-auto md:h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={product.images[0] || '/api/placeholder/400/400'}
              alt={product.name}
              fill
              className="object-cover hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 256px"
            />
            {product.isNewProduct && (
              <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-md">NEW</span>
            )}
            {discount > 0 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md">-{discount}%</span>
            )}
          </div>
        </Link>

        <div className="flex-1 p-6">
          <Link href={`/products/${product._id}`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.brand}</p>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">${product.price}</span>
              {product.comparePrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">${product.comparePrice}</span>
              )}
            </div>
            <Button
              variant="primary"
              size="lg"
              isLoading={isAddingToCart}
              onClick={() => onAddToCart(product._id)}
              disabled={product.stock === 0}
              leftIcon={!isAddingToCart ? <ShoppingCart className="w-4 h-4" /> : undefined}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>

          {product.stock > 0 && product.stock < 20 && (
            <p className="text-sm text-orange-600 mt-3">Only {product.stock} items left in stock</p>
          )}

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="flex items-center gap-1 text-xs text-gray-500"><Truck className="w-3 h-3" /> Free shipping over $50</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><Shield className="w-3 h-3" /> 30-day returns</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}