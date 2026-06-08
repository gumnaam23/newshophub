'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Trash2,
  ShoppingCart,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Package,
  X,
  Share2
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  comparePrice: number;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  isNew: boolean;
}

export default function WishlistPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    fetchWishlist();
  }, [session, router]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      
      if (data.success) {
        setWishlist(data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      showNotification('Failed to load wishlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const removeFromWishlist = async (productId: string) => {
    setRemovingId(productId);
    
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWishlist(prev => prev.filter(item => item._id !== productId));
        showNotification('Removed from wishlist', 'success');
      } else {
        showNotification(data.error || 'Failed to remove item', 'error');
      }
    } catch (error) {
      console.error(error)
      showNotification('Failed to remove item', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  const addToCart = async (product: WishlistItem) => {
    setAddingToCart(product._id);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification(`${product.name} added to cart!`, 'success');
      } else {
        showNotification(data.error || 'Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error(error)
      showNotification('Failed to add to cart', 'error');
    } finally {
      setAddingToCart(null);
    }
  };

  const moveToCart = async (product: WishlistItem) => {
    await addToCart(product);
    await removeFromWishlist(product._id);
  };

  const shareWishlist = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: `Check out my wishlist with ${wishlist.length} items!`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      showNotification('Wishlist link copied to clipboard!', 'success');
      setShareModalOpen(false);
    }
  };

  const WishlistItemCard = ({ item, index }: { item: WishlistItem; index: number }) => {
    const discount = item.comparePrice > item.price 
      ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
      : 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
      >
        <div className="flex flex-col sm:flex-row gap-6 p-6">
          {/* Product Image */}
          <Link href={`/products/${item._id}`} className="sm:w-32">
            <div className="relative aspect-square sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={item.images[0] || '/api/placeholder/200/200'}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
              {item.isNew && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                  NEW
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                  -{discount}%
                </span>
              )}
            </div>
          </Link>
          
          {/* Product Info */}
          <div className="flex-1">
            <Link href={`/products/${item._id}`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 hover:text-blue-600 transition-colors">
                {item.name}
              </h3>
            </Link>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {item.brand}
            </p>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(item.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({item.reviewCount})</span>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-blue-600">
                ${item.price}
              </span>
              {item.comparePrice > item.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${item.comparePrice}
                </span>
              )}
              {item.stock < 10 && item.stock > 0 && (
                <span className="text-xs text-orange-500">Only {item.stock} left</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="sm"
                isLoading={addingToCart === item._id}
                onClick={() => addToCart(item)}
                disabled={item.stock === 0}
                leftIcon={!addingToCart ? <ShoppingCart className="w-4 h-4" /> : undefined}
              >
                {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveToCart(item)}
                disabled={item.stock === 0}
              >
                Move to Cart
              </Button>
              
              <button
                onClick={() => removeFromWishlist(item._id)}
                disabled={removingId === item._id}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                {removingId === item._id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const EmptyWishlist = () => {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-16 h-16 text-red-500" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Save your favorite items here by clicking the heart icon on any product
        </p>
        <Link href="/products">
          <Button variant="primary" size="lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  };

  // Share Modal
  const ShareModal = () => {
    if (!shareModalOpen) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setShareModalOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Share Wishlist
            </h3>
            <button onClick={() => setShareModalOpen(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Share your wishlist with friends and family
          </p>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={typeof window !== 'undefined' ? window.location.href : ''}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm"
            />
            <Button variant="primary" onClick={shareWishlist}>
              Copy Link
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 text-center">
              Share on social media
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <button className="p-2 bg-[#1877f2] rounded-full text-white hover:opacity-90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="p-2 bg-[#1da1f2] rounded-full text-white hover:opacity-90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.337-6.235 9.9 9.9 0 001.58-5.35c0-.339-.023-.678-.068-1.016z"/>
                </svg>
              </button>
              <button className="p-2 bg-[#e4405f] rounded-full text-white hover:opacity-90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <Link href="/account" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  My Wishlist
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
                </p>
              </div>
              {wishlist.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShareModalOpen(true)}
                  leftIcon={<Share2 className="w-4 h-4" />}
                >
                  Share Wishlist
                </Button>
              )}
            </div>
          </div>
          
          {/* Wishlist Items */}
          {wishlist.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {wishlist.map((item, idx) => (
                  <WishlistItemCard key={item._id} item={item} index={idx} />
                ))}
              </div>
            </AnimatePresence>
          )}
          
          {/* Recommendations */}
          {wishlist.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* You can add recommended products here */}
                <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Recommendations coming soon</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Share Modal */}
      <ShareModal />
      
      {/* Notification Toast */}
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3"
          style={{
            background: notification.type === 'success' 
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #ef4444, #dc2626)'
          }}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : (
            <AlertCircle className="w-5 h-5 text-white" />
          )}
          <span className="text-white font-medium">{notification.message}</span>
        </motion.div>
      )}
      
    </>
  );
}