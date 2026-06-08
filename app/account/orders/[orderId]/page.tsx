'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
  CreditCard,
  Download,
  Printer,
  MessageCircle,
  Star,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
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
  tracking?: {
    number: string;
    carrier: string;
    url: string;
    updates: TrackingUpdate[];
  };
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface TrackingUpdate {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export default function OrderDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    fetchOrder();
  }, [session, router, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
      } else {
        router.push('/account/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    setCancelling(true);
    
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchOrder();
      } else {
        alert(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending Confirmation' },
      processing: { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Processing' },
      shipped: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Shipped' },
      delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
      cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderTimeline = () => {
    const steps = [
      { label: 'Order Placed', status: 'completed', date: order?.createdAt, icon: Package },
      { label: 'Payment Confirmed', status: order?.paymentStatus === 'paid' ? 'completed' : 'current', date: order?.createdAt, icon: CreditCard },
      { label: 'Processing', status: order?.status === 'processing' ? 'current' : order?.status === 'shipped' || order?.status === 'delivered' ? 'completed' : 'pending', icon: RefreshCw },
      { label: 'Shipped', status: order?.status === 'shipped' ? 'current' : order?.status === 'delivered' ? 'completed' : 'pending', icon: Truck },
      { label: 'Delivered', status: order?.status === 'delivered' ? 'current' : 'pending', icon: CheckCircle }
    ];
    
    return (
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-6">
          Order Timeline
        </h3>
        <div className="relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            
            return (
              <div key={idx} className="flex items-start gap-4 mb-6 last:mb-0">
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                }`}>
                  <Icon className={`w-5 h-5 text-white`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </h4>
                  {step.date && (
                    <p className="text-sm text-gray-500">
                      {formatDate(step.date)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TrackingInfo = () => {
    if (!order?.tracking) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Tracking Information
          </h3>
          <a
            href={order.tracking.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Track on {order.tracking.carrier}
          </a>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Tracking Number:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {order.tracking.number}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Carrier:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {order.tracking.carrier}
            </span>
          </div>
        </div>
        
        {order.tracking.updates && order.tracking.updates.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Tracking Updates
            </h4>
            <div className="space-y-3">
              {order.tracking.updates.map((update, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 dark:text-white">{update.status}</p>
                    <p className="text-gray-500">{update.location}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(update.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
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
             {` The order you're looking for doesn't exist.`}
            </p>
            <Link href="/account/orders">
              <Button variant="primary">View All Orders</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const StatusConfig = getStatusConfig(order.status);
  const StatusIcon = StatusConfig.icon;

  return (
    <>
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/account/orders" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Order #{order.orderNumber}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium ${StatusConfig.bg} ${StatusConfig.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {StatusConfig.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    Placed on {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>
              
              {order.status === 'pending' && (
                <Button
                  variant="danger"
                  onClick={handleCancelOrder}
                  isLoading={cancelling}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Order Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                <OrderTimeline />
              </div>
              
              {/* Tracking Info */}
              <TrackingInfo />
              
              {/* Order Items */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <Link href={`/products/${item.productId}`}>
                          <h4 className="font-medium text-gray-900 dark:text-white hover:text-blue-600">
                            {item.name}
                          </h4>
                        </Link>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: ${item.price} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">
                      {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                    <span className="text-gray-900 dark:text-white">${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Payment Method
                  </h3>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                     order.paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'}
                  </p>
                  <p className={`mt-1 ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.paymentStatus === 'paid' ? 'Payment Confirmed' : 'Pending Payment'}
                  </p>
                </div>
              </div>
              
              {/* Estimated Delivery */}
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Estimated Delivery
                    </h3>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button variant="outline" fullWidth leftIcon={<Download className="w-4 h-4" />}>
                  Download Invoice
                </Button>
                <Button variant="outline" fullWidth leftIcon={<Printer className="w-4 h-4" />}>
                  Print Order
                </Button>
                {order.status === 'delivered' && (
                  <Button variant="primary" fullWidth leftIcon={<Star className="w-4 h-4" />}>
                    Write a Review
                  </Button>
                )}
                <Button variant="ghost" fullWidth leftIcon={<MessageCircle className="w-4 h-4" />}>
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}