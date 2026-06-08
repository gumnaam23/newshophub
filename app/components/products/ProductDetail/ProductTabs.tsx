'use client';

import { motion } from 'framer-motion';
import ProductReviews from './ProductReviews';
import { IProduct } from '@/models/Product';
import { IReview } from '@/type';
import { useState } from 'react';

type TabType = 'description' | 'specifications' | 'reviews';



interface ProductTabsProps {
  product: IProduct;
  reviews: IReview[];
  productId: string;
  onReviewSubmitted: () => void;
}

export default function ProductTabs({ product, reviews, productId, onReviewSubmitted }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-12">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-8 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-4 font-medium transition-colors relative whitespace-nowrap ${
              activeTab === 'description'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Description
            {activeTab === 'description' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`py-4 font-medium transition-colors relative whitespace-nowrap ${
              activeTab === 'specifications'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Specifications
            {activeTab === 'specifications' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 font-medium transition-colors relative whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Reviews ({reviews.length})
            {activeTab === 'reviews' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'description' && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.longDescription || product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-3">Key Features</h3>
                <ul className="list-disc list-inside space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-600 dark:text-gray-400">
                      {feature}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {activeTab === 'specifications' && product.specifications && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="w-1/3 font-medium text-gray-900 dark:text-white">
                  {key}
                </span>
                <span className="w-2/3 text-gray-600 dark:text-gray-400">
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <ProductReviews
            productId={productId}
            reviews={reviews as IReview[]}
            onReviewSubmitted={onReviewSubmitted}
          />
        )}
      </div>
    </div>
  );
}