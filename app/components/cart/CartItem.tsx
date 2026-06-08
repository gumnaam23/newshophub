'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, Heart, Loader2 } from 'lucide-react';

interface CartItemProps {
  item: {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image: string;
    total: number;
    stock: number;
  };
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => Promise<void>;
  onRemoveItem: (cartItemId: string) => Promise<void>;
  isUpdating: boolean;
  isRemoving: boolean;
}

export default function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem,
  isUpdating,
  isRemoving
}: CartItemProps) {
  const [localUpdating, setLocalUpdating] = useState(false);
  const [localRemoving, setLocalRemoving] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.stock) return;
    setLocalUpdating(true);
    await onUpdateQuantity(item.id, newQuantity);
    setLocalUpdating(false);
  };

  const handleRemoveItem = async () => {
    setLocalRemoving(true);
    await onRemoveItem(item.id);
    setLocalRemoving(false);
  };

  const isLoading = isUpdating || localUpdating;
  const isDeleting = isRemoving || localRemoving;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-col sm:flex-row gap-6 py-6 border-b border-gray-200 dark:border-gray-700"
    >
      <Link href={`/products/${item.productId}`} className="sm:w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </Link>
      
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div>
            <Link href={`/products/${item.productId}`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                {item.name}
              </h3>
            </Link>
            {item.size && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Size: <span className="font-medium">{item.size}</span>
              </p>
            )}
            {item.color && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Color: <span className="font-medium">{item.color}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              In Stock: <span className="font-medium text-green-600">{item.stock} items</span>
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${item.total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              ${item.price.toFixed(2)} each
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => handleUpdateQuantity(item.quantity - 1)}
                disabled={isLoading || item.quantity <= 1}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : item.quantity}
              </span>
              <button
                onClick={() => handleUpdateQuantity(item.quantity + 1)}
                disabled={isLoading || item.quantity >= item.stock}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={handleRemoveItem}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span className="text-sm">Remove</span>
            </button>
          </div>
          
          <button className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Move to Wishlist</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}