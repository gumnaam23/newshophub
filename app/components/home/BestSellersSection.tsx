'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '@/type';

interface BestSellersSectionProps {
  initialProducts: Product[];
}

export function BestSellersSection({ initialProducts }: BestSellersSectionProps) {
  return (
    <div  className="py-16 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Best Sellers
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Most popular items this month
            </p>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2"
            onClick={() => window.location.href = '/products?sort=bestselling'}
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialProducts.map((product, idx) => (
            <ProductCard key={product._id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}