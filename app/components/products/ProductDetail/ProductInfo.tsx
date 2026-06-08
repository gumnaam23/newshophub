'use client';

import { IProduct } from '@/models/Product';
import { Star, Truck, Shield, RefreshCw } from 'lucide-react';

interface ProductInfoProps {
  product: IProduct;
  discount: number;
}

export default function ProductInfo({ product, discount }: ProductInfoProps) {
  return (
    <div>
      {/* Badges */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {product.isNewProduct && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
            New Arrival
          </span>
        )}
        {discount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
            {discount}% OFF
          </span>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {product.name}
      </h1>

      {/* Brand */}
      <p className="text-gray-600 dark:text-gray-400 mb-4">by {product.brand}</p>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {product.rating} out of 5 ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            ${product.price}
          </span>
          {product.comparePrice > product.price && (
            <>
              <span className="text-xl text-gray-500 line-through">
                ${product.comparePrice}
              </span>
              <span className="text-green-600 font-semibold">
                Save ${(product.comparePrice - product.price).toFixed(2)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Short Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {product.description}
      </p>

      {/* Delivery Info */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <Truck className="w-5 h-5 text-blue-600" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>30-day money-back guarantee</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <RefreshCw className="w-5 h-5 text-blue-600" />
          <span>Easy returns within 30 days</span>
        </div>
      </div>
    </div>
  );
}