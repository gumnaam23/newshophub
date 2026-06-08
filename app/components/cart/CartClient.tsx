'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

import CartItem from '@/app/components/cart/CartItem';
import CartSummary from '@/app/components/cart/CartSummary';
import EmptyCart from '@/app/components/cart/EmptyCart';
import RecommendedProducts from '@/app/components/cart/RecommendedProducts';
import { IProduct } from '@/models/Product';

interface CartItemType {
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
}

interface CartSummaryType {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
  totalQuantity: number;
}

interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount: number;
  description: string;
}

export default function CartClient() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [summary, setSummary] = useState<CartSummaryType>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    itemCount: 0,
    totalQuantity: 0
  });
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      if (data.success) {
        setCartItems(data.data.items);
        setSummary(data.data.summary);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      showNotification('Failed to load cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommended products
  const fetchRecommendedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=4&sort=random');
      const data = await response.json();
      if (data.success) {
        setRecommendedProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      setLoading(false);
      return;
    }
    
    fetchCart();
    fetchRecommendedProducts();
    
    // Load saved coupon from session storage
    const savedCoupon = sessionStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon));
    }
  }, [session, status]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Update quantity
  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItemId(cartItemId);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity: newQuantity })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchCart();
        // Re-validate coupon after cart update
        if (appliedCoupon) {
          await validateAndApplyCoupon(appliedCoupon.code);
        }
        showNotification('Cart updated successfully', 'success');
      } else {
        showNotification(data.error || 'Failed to update quantity', 'error');
      }
    } catch (error) {
      console.error(error);
      showNotification('Failed to update cart', 'error');
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Remove item
  const removeItem = async (cartItemId: string) => {
    setRemovingItemId(cartItemId);
    
    try {
      const response = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchCart();
        // Re-validate coupon after cart update
        if (appliedCoupon) {
          await validateAndApplyCoupon(appliedCoupon.code);
        }
        showNotification('Item removed from cart', 'success');
      } else {
        showNotification(data.error || 'Failed to remove item', 'error');
      }
    } catch (error) {
      console.error(error);
      showNotification('Failed to remove item', 'error');
    } finally {
      setRemovingItemId(null);
    }
  };

  // Validate and apply coupon
  const validateAndApplyCoupon = async (code: string) => {
    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');
    
    try {
      // First validate the coupon
      const validateResponse = await fetch('/api/cart/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: code,
          subtotal: summary.subtotal 
        })
      });
      
      const validateData = await validateResponse.json();
      
      if (!validateData.valid) {
        setCouponError(validateData.error || 'Invalid coupon code');
        setAppliedCoupon(null);
        sessionStorage.removeItem('appliedCoupon');
        
        // Reset summary without discount
        setSummary(prev => ({
          ...prev,
          discount: 0,
          total: prev.subtotal + prev.shipping + prev.tax
        }));
        return;
      }
      
      // Apply the coupon
      const applyResponse = await fetch('/api/cart/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: code,
          subtotal: summary.subtotal 
        })
      });
      
      const applyData = await applyResponse.json();
      
      if (applyData.success) {
        const couponData = {
          code: applyData.data.code,
          type: applyData.data.type,
          value: applyData.data.value,
          discount: applyData.data.discount,
          description: applyData.data.description || ''
        };
        
        setAppliedCoupon(couponData);
        sessionStorage.setItem('appliedCoupon', JSON.stringify(couponData));
        
        // Update summary with discount
        setSummary(prev => ({
          ...prev,
          discount: applyData.data.discount,
          total: prev.subtotal + prev.shipping + prev.tax - applyData.data.discount
        }));
        
        setCouponSuccess(`Coupon applied! You saved $${applyData.data.discount.toFixed(2)}`);
        
        setTimeout(() => setCouponSuccess(''), 3000);
      } else {
        setCouponError(applyData.error || 'Failed to apply coupon');
        setAppliedCoupon(null);
        sessionStorage.removeItem('appliedCoupon');
      }
    } catch (error) {
      console.error('Coupon error:', error);
      setCouponError('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    sessionStorage.removeItem('appliedCoupon');
    
    // Reset summary without discount
    setSummary(prev => ({
      ...prev,
      discount: 0,
      total: prev.subtotal + prev.shipping + prev.tax
    }));
    
    showNotification('Coupon removed', 'success');
  };

  const handleApplyCoupon = async (code: string) => {
    if (!code.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    await validateAndApplyCoupon(code);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Login to View Cart
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please login or create an account to view and manage your cart.
          </p>
          <Link href="/auth/login">
            <Button variant="primary" size="lg">
              Login Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">Shopping Cart</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Shopping Cart
          {cartItems.length > 0 && (
            <span className="text-lg text-gray-500 ml-2">
              ({summary.totalQuantity} items)
            </span>
          )}
        </h1>
        
        {/* Notification Toast */}
        <AnimatePresence>
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
                <XCircle className="w-5 h-5 text-white" />
              )}
              <span className="text-white font-medium">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemoveItem={removeItem}
                      isUpdating={updatingItemId === item.id}
                      isRemoving={removingItemId === item.id}
                    />
                  ))}
                </AnimatePresence>
                
                {/* Continue Shopping Link */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
              
              {/* Recommended Products */}
              <RecommendedProducts products={recommendedProducts} />
            </div>
            
            {/* Cart Summary */}
            <div>
              <CartSummary
                summary={summary}
                appliedCoupon={appliedCoupon}
                onRemoveCoupon={removeCoupon}
                onApplyCoupon={handleApplyCoupon}
                isApplyingCoupon={couponLoading}
                couponError={couponError}
                couponSuccess={couponSuccess}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}