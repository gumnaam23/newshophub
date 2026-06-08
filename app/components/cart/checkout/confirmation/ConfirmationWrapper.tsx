'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Package,
  Truck,
  Calendar,
  MapPin,
  CreditCard,
  Download,
  Share2,
  Printer,
  ShoppingBag,
  Loader2,
  Star
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Product } from '@/type';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  estimatedDelivery: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

export default function ConfirmationWrapper() {
  const { data: session, status} = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
      if (status === "loading") return;

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return;
  }
    if (!orderId) {
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        
        if (data.success) {
          setOrder(data.data);
          
          // Fetch recommended products based on order
          const recRes = await fetch('/api/products?limit=4&sort=random');
          const recData = await recRes.json();
          if (recData.success) {
            setRecommendedProducts(recData.data);
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [session, router, orderId]);

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order?.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Order Confirmation',
        text: `My order #${order?.orderNumber} has been confirmed!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const StatusTimeline = () => {
    const steps = [
      { label: 'Order Placed', status: 'completed', date: order?.createdAt },
      { label: 'Payment Confirmed', status: order?.paymentStatus === 'paid' ? 'completed' : 'current', date: order?.createdAt },
      { label: 'Processing', status: order?.status === 'processing' ? 'current' : order?.status === 'shipped' ? 'completed' : 'pending' },
      { label: 'Shipped', status: order?.status === 'shipped' ? 'current' : 'pending' },
      { label: 'Delivered', status: order?.status === 'delivered' ? 'current' : 'pending' }
    ];

    return (
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                step.status === 'completed' 
                  ? 'bg-green-500 text-white'
                  : step.status === 'current'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {step.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <div className={`w-3 h-3 rounded-full ${
                    step.status === 'current' ? 'bg-blue-600' : 'bg-gray-400'
                  }`} />
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {step.label}
              </p>
              {step.date && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(step.date).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="relative mt-4">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700" />
          <div className="absolute top-0 left-0 h-0.5 bg-green-500" style={{ width: '60%' }} />
        </div>
      </div>
    );
  };

  const OrderItemComponent = ({ item }: { item: OrderItem }) => {
    return (
      <div className="flex gap-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <Link href={`/products/${item.productId}`}>
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </Link>
        <div className="flex-1">
          <Link href={`/products/${item.productId}`}>
            <h4 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600">
              {item.name}
            </h4>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Quantity: {item.quantity}
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
            {(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Price per item</p>
          <p className="font-medium">${item.price.toFixed(2)}</p>
        </div>
      </div>
    );
  };

  const RecommendedProducts = () => {
    if (recommendedProducts.length === 0) return null;
    
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          You Might Also Like
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <Link href={`/products/${product._id}`}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">${product.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
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

  if (!order) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {`We couldn't find the order you're looking for.`}
            </p>
            <Link href="/">
              <Button variant="primary">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center mb-8"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Order #{order.orderNumber} has been placed successfully.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              A confirmation email has been sent to {session?.user?.email}
            </p>
          </motion.div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadInvoice}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Invoice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-4 h-4" />}
            >
              Share
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Order Status Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Status
                </h2>
                <StatusTimeline />
              </div>
              
              {/* Order Items */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Order Items
                </h2>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.items.map((item, idx) => (
                    <OrderItemComponent key={idx} item={item} />
                  ))}
                </div>
              </div>
              
              {/* Recommended Products */}
              <RecommendedProducts />
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Order Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Shipping Address
                  </h3>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Payment Method
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                       order.paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.paymentStatus === 'paid' ? 'Payment confirmed' : 'Pending payment'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Estimated Delivery */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Estimated Delivery
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  {`You'll receive tracking information via email once your order ships.`}
                </p>
              </div>
            </div>
          </div>
          
          {/* Continue Shopping Button */}
          <div className="text-center mt-12">
            <Link href="/products">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ShoppingBag className="w-4 h-4" />}
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
    </>
  );
}