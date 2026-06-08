'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface ProductActionsProps {
  productId: string;
  stock: number;
  sizes: string[];
  colors: string[];
  onAddToCart: (quantity: number, size: string | null, color: string | null) => Promise<void>;
  onAddToWishlist: () => Promise<void>;
  onShare: () => void;
  isAddingToCart: boolean;
  isAddingToWishlist: boolean;
}

export default function ProductActions({
  productId,
  stock,
  sizes,
  colors,
  onAddToCart,
  onAddToWishlist,
  onShare,
  isAddingToCart,
  isAddingToWishlist,
}: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, selectedSize || null, selectedColor || null);
  };

  return (
    <div>
      {/* Size Selection */}
      {sizes && sizes.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Select Size</h3>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg transition-all ${
                  selectedSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {colors && colors.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Select Color</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quantity</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= stock}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500">{stock} items available</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          isLoading={isAddingToCart}
          onClick={handleAddToCart}
          disabled={stock === 0}
          leftIcon={!isAddingToCart ? <ShoppingCart className="w-5 h-5" /> : undefined}
        >
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onAddToWishlist}
          isLoading={isAddingToWishlist}
          leftIcon={!isAddingToWishlist ? <Heart className="w-5 h-5" /> : undefined}
        >
          Wishlist
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onShare}
          leftIcon={<Share2 className="w-5 h-5" />}
        >
          Share
        </Button>
      </div>
    </div>
  );
}