'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

export default function ProductNotFound() {
  return (
    <>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold text-gray-900 dark:text-white mb-4"
          >
            404
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-semibold text-gray-900 dark:text-white mb-2"
          >
            Product Not Found
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 mb-8"
          >
            {`The product you're looking for doesn't exist or has been removed.`}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Link href="/products">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<ShoppingBag className="w-4 h-4" />}
              >
                Browse All Products
              </Button>
            </Link>
            
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                leftIcon={<Home className="w-4 h-4" />}
              >
                Back to Home
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Need help finding something?
            </h3>
            <Link href="/contact" className="text-sm text-blue-600 hover:text-blue-700">
              Contact our support team
            </Link>
          </motion.div>
        </div>
      </div>
      
    </>
  );
}