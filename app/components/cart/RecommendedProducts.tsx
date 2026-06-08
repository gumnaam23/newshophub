'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface RecommendedProductsProps {
  products: Product[];
}

export default function RecommendedProducts({ products }: RecommendedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        You May Also Like
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
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
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-xl font-bold text-blue-600">${product.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}