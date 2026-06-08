'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
          >
            <Link href={`/products/${product._id}`}>
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.images[0] || '/api/placeholder/400/400'}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                <p className="text-xl font-bold text-blue-600">${product.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}