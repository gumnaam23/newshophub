'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Product } from '@/type';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, index, onAddToCart }: ProductCardProps) {
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const router = useRouter()
  
  const handleAddToCart = async () => {
    if (!session) {
      window.location.href = '/auth/login';
      return;
    }
    
    if (onAddToCart) {
      onAddToCart(product._id);
      return;
    }
    
    setAddingToCart(true);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          size: null,
          color: null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Trigger a custom event for cart notification
        window.dispatchEvent(new CustomEvent('cart-updated', {
          detail: { message: `${product.name} added to cart!`, type: 'success' }
        }));
      } else {
        throw new Error(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      window.dispatchEvent(new CustomEvent('cart-updated', {
        detail: { 
          message: error instanceof Error ? error.message : 'Failed to add to cart', 
          type: 'error' 
        }
      }));
    } finally {
      setAddingToCart(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={()=>{
       router.push(`/products/${product._id}`)
    } }
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0] || '/api/placeholder/400/400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {product.isNewProduct && (
          <span className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            New
          </span>
        )}
        
        {product.comparePrice > product.price && (
          <span className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
          </span>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-5 h-5 text-gray-800" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
          </motion.button>
        </motion.div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {product.rating}
            </span>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${product.price}
          </span>
          {product.comparePrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              ${product.comparePrice}
            </span>
          )}
        </div>

        <Button
          variant="primary"
          size="md"
          fullWidth
          isLoading={addingToCart}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          leftIcon={!addingToCart ? <ShoppingCart className="w-4 h-4" /> : undefined}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </motion.div>
  );
}