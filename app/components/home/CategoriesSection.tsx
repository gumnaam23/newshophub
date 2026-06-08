'use client';

import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Category } from '@/type';

interface CategoriesSectionProps {
  initialCategories: Category[];
}

const defaultCategories = [
  { _id: '1', name: 'Electronics', slug: 'electronics', image: '/api/placeholder/400/300', productCount: 245 },
  { _id: '2', name: 'Fashion', slug: 'fashion', image: '/api/placeholder/400/300', productCount: 189 },
  { _id: '3', name: 'Home & Living', slug: 'home-living', image: '/api/placeholder/400/300', productCount: 156 },
  { _id: '4', name: 'Books', slug: 'books', image: '/api/placeholder/400/300', productCount: 324 }
];

export function CategoriesSection({ initialCategories }: CategoriesSectionProps) {
  const displayCategories = initialCategories.length > 0 ? initialCategories : defaultCategories;

  const getCategoryIcon = (slug: string) => {
    return <ShoppingBag className="w-20 h-20 text-white" />;
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of products across different categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category, idx) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => window.location.href = `/products?category=${category.slug}`}
            >
              <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-6 h-64 flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
                {getCategoryIcon(category.slug)}
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10 mt-4">
                  {category.name}
                </h3>
                <p className="text-white/90 mb-4 relative z-10">
                  {category.productCount}+ Products
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full relative z-10 hover:bg-white/30 transition-all"
                >
                  Shop Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}