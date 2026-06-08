'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Eye, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { IProduct } from '@/models/Product';

interface ProductCardProps {
  product: IProduct;
  index: number;
  onAddToCart: (productId: string) => void;
  isAddingToCart: boolean;
}

export default function ProductCard({ product, index, onAddToCart, isAddingToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {product.isNewProduct && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-md font-semibold">NEW</span>
        )}
        {discount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-semibold">-{discount}%</span>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-md font-semibold">OUT OF STOCK</span>
        )}
      </div>

      {/* Product Image */}
      <Link href={`/products/${product._id}`}>
        <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-700">
          <img
            src={product.images[0] || '/api/placeholder/400/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3"
          >
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-white p-2 rounded-full">
              <Eye className="w-5 h-5 text-gray-800" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-white p-2 rounded-full">
              <Heart className="w-5 h-5 text-gray-800" />
            </motion.button>
          </motion.div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.brand}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${product.price}</span>
          {product.comparePrice > product.price && (
            <span className="text-sm text-gray-500 line-through">${product.comparePrice}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="md"
          fullWidth
          isLoading={isAddingToCart}
          onClick={() => onAddToCart(product._id)}
          disabled={product.stock === 0}
          leftIcon={!isAddingToCart ? <ShoppingCart className="w-4 h-4" /> : undefined}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </motion.div>
  );
}