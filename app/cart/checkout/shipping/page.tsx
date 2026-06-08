'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  Package,
  Clock,
  Calendar,
  CheckCircle,
  Loader2,
  Shield,
  Gift,
  Box,
  Zap,
  LucideIcon
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Address, CartSummary } from '@/type';

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: LucideIcon;
  carrier: string;
}





export default function ShippingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('standard');
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });




  // Shipping methods
  const shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Reliable delivery to your doorstep',
      price: 5.99,
      estimatedDays: '5-7 business days',
      icon: Truck,
      carrier: 'USPS'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Fast and tracked delivery',
      price: 12.99,
      estimatedDays: '2-3 business days',
      icon: Zap,
      carrier: 'FedEx'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next day delivery',
      price: 24.99,
      estimatedDays: '1 business day',
      icon: Clock,
      carrier: 'UPS'
    },
    {
      id: 'free',
      name: 'Free Shipping',
      description: 'Economy delivery',
      price: 0,
      estimatedDays: '7-10 business days',
      icon: Gift,
      carrier: 'USPS Economy'
    }
  ];

  useEffect(() => {
    if (!session) {
      router.push('/auth/login?from=/cart/checkout/shipping');
      return;
    }

    // Get saved address from session storage
    const savedAddressId = sessionStorage.getItem('checkoutAddress');
    if (!savedAddressId) {
      router.push('/cart/checkout');
      return;
    }

    const fetchData = async () => {
      try {
        const [cartRes, addressRes] = await Promise.all([
          fetch('/api/cart'),
          fetch('/api/user/addresses')
        ]);

        const cartData = await cartRes.json();
        const addressData = await addressRes.json();

        if (cartData.success) {
          setCartSummary(cartData.data.summary);
          
          // Apply free shipping if subtotal > $50
          if (cartData.data.summary.subtotal > 50) {
            setSelectedMethod('free');
          }
        }

        if (addressData.success) {
          const address = addressData.data.find((a: Address) => a._id === savedAddressId);
          if (address) {
            setShippingAddress(address);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, router]);

  const handleContinue = async () => {
    const method = shippingMethods.find(m => m.id === selectedMethod);
    if (!method) return;

    setSaving(true);

    try {
      // Save shipping method to session storage
      sessionStorage.setItem('shippingMethod', JSON.stringify({
        id: method.id,
        name: method.name,
        price: method.price,
        carrier: method.carrier,
        estimatedDays: method.estimatedDays
      }));

      // Update cart with shipping cost
      await fetch('/api/cart/update-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingCost: method.price })
      });

      router.push('/cart/checkout/payment');
    } catch (error) {
      console.error('Error saving shipping method:', error);
    } finally {
      setSaving(false);
    }
  };

  const ShippingMethodCard = ({ method, index }: { method: ShippingMethod; index: number }) => {
    const isSelected = selectedMethod === method.id;
    const isEligibleForFree = cartSummary.subtotal > 50 && method.id === 'free';
    const Icon = method.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
        } ${method.id === 'free' && cartSummary.subtotal > 50 ? 'ring-2 ring-green-500' : ''}`}
        onClick={() => setSelectedMethod(method.id)}
      >
        {isSelected && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="w-6 h-6 text-blue-500" />
          </div>
        )}

        {method.id === 'free' && cartSummary.subtotal > 50 && (
          <div className="absolute top-4 left-4">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Eligible
            </span>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${
            isSelected 
              ? 'bg-blue-100 dark:bg-blue-900/40' 
              : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <Icon className={`w-6 h-6 ${
              isSelected ? 'text-blue-600' : 'text-gray-600'
            }`} />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {method.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {method.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500">
                    Carrier: {method.carrier}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {method.estimatedDays}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {method.price === 0 ? 'Free' : `$${method.price}`}
                </p>
                {method.price > 0 && cartSummary.subtotal > 50 && (
                  <p className="text-xs text-green-600">Free shipping available</p>
                )}
              </div>
            </div>

            {/* Progress bar for express shipping */}
            {method.id === 'express' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Order processing</span>
                  <span>In transit</span>
                  <span>Out for delivery</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Benefits for standard shipping */}
        {method.id === 'standard' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Insurance included
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                Tracking provided
              </span>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const DeliveryDateEstimator = () => {
    const getEstimatedDate = () => {
      const today = new Date();
      let daysToAdd = 5;
      
      if (selectedMethod === 'express') daysToAdd = 2;
      if (selectedMethod === 'overnight') daysToAdd = 1;
      if (selectedMethod === 'free') daysToAdd = 7;
      
      const estimatedDate = new Date(today);
      estimatedDate.setDate(today.getDate() + daysToAdd);
      
      return estimatedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Estimated Delivery Date
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getEstimatedDate()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              *Delivery times may vary based on your location
            </p>
          </div>
        </div>
      </div>
    );
  };

  const OrderSummary = () => {
    const method = shippingMethods.find(m => m.id === selectedMethod);
    const subtotal = cartSummary.subtotal;
    const shipping = method?.price || 0;
    const tax = (subtotal + shipping) * 0.1;
    const total = subtotal + shipping + tax;

    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sticky top-20">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Order Summary
        </h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address Summary */}
        {shippingAddress && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Shipping to:
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.street}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
              <p>{shippingAddress.country}</p>
              <p className="mt-1">Phone: {shippingAddress.phone}</p>
            </div>
            <Link href="/cart/checkout" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
              Change Address
            </Link>
          </div>
        )}

        {/* Free Shipping Reminder */}
        {cartSummary.subtotal < 50 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-400">
              Add ${(50 - cartSummary.subtotal).toFixed(2)} more to get free shipping!
            </p>
            <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${(cartSummary.subtotal / 50) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
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
          {/* Checkout Progress */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-center">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-green-600">Address</p>
              </div>
              <div className="flex-1 h-0.5 bg-green-500"></div>
              <div className="flex-1 text-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  2
                </div>
                <p className="text-sm font-medium text-blue-600">Shipping</p>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex-1 text-center">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 text-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  3
                </div>
                <p className="text-sm text-gray-500">Payment</p>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex-1 text-center">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 text-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  4
                </div>
                <p className="text-sm text-gray-500">Confirmation</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Shipping Methods */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Select Shipping Method
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose the delivery option that works best for you
                </p>
                
                <div className="space-y-4">
                  {shippingMethods.map((method, idx) => (
                    <ShippingMethodCard key={method.id} method={method} index={idx} />
                  ))}
                </div>

                {/* Delivery Date Estimator */}
                <DeliveryDateEstimator />

                {/* Shipping Tips */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Shipping Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Free shipping applies to orders over $50
                    </li>
                    <li className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      All orders are fully insured
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Cut-off time for same-day shipping is 2 PM EST
                    </li>
                  </ul>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link href="/cart/checkout">
                    <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                      Back to Address
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    onClick={handleContinue}
                    isLoading={saving}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Right Column - Order Summary */}
            <div>
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}