'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package,
  Search,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface TrackingInfo {
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: {
    status: string;
    date: string;
    description: string;
    location?: string;
  }[];
  estimatedDelivery: string;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  currentLocation?: string;
  items: {
    name: string;
    quantity: number;
    image: string;
  }[];
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber || !email) {
      setError('Please enter both order number and email');
      return;
    }
    
    setLoading(true);
    setError('');
    setSearched(true);
    
    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTrackingInfo(data.data);
      } else {
        setError(data.error || 'Order not found');
        setTrackingInfo(null);
      }
    } catch (error) {
      console.error(error)
      setError('Failed to track order. Please try again.');
      setTrackingInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  const TrackingTimeline = ({ history }: { history: TrackingInfo['statusHistory'] }) => {
    return (
      <div className="relative">
        {history.map((item, idx) => (
          <div key={idx} className="flex gap-4 mb-6 last:mb-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center z-10 relative">
                {getStatusIcon(item.status)}
              </div>
              {idx < history.length - 1 && (
                <div className="absolute top-10 left-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.description}
                  </p>
                  {item.location && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4"
            >
              <Package className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Track Your Order
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your order number and email to track your package
            </p>
          </div>
          
          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Number *
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., ORD-123456"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
                leftIcon={!loading ? <Search className="w-4 h-4" /> : undefined}
              >
                Track Order
              </Button>
            </form>
          </motion.div>
          
          {/* Results */}
          {searched && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Order Not Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {error}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setOrderNumber('');
                        setEmail('');
                        setSearched(false);
                        setTrackingInfo(null);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Try Again
                    </button>
                    <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                      Contact Support
                    </Link>
                  </div>
                </div>
              ) : trackingInfo && (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          Order #{trackingInfo.orderNumber}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trackingInfo.status)}`}>
                            {getStatusIcon(trackingInfo.status)}
                            {trackingInfo.status.charAt(0).toUpperCase() + trackingInfo.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      {trackingInfo.estimatedDelivery && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Estimated Delivery</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {new Date(trackingInfo.estimatedDelivery).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Tracking Number */}
                    {trackingInfo.trackingNumber && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Tracking Number</p>
                            <p className="font-mono text-gray-900 dark:text-white">
                              {trackingInfo.trackingNumber}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Carrier: {trackingInfo.carrier}
                            </p>
                          </div>
                          {trackingInfo.trackingUrl && (
                            <a
                              href={trackingInfo.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Track on {trackingInfo.carrier} →
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Current Location */}
                    {trackingInfo.currentLocation && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                        <MapPin className="w-4 h-4" />
                        <span>Current Location: {trackingInfo.currentLocation}</span>
                      </div>
                    )}
                    
                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Order Items
                      </h3>
                      <div className="space-y-2">
                        {trackingInfo.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tracking Timeline */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Tracking History
                      </h3>
                      <TrackingTimeline history={trackingInfo.statusHistory} />
                    </div>
                  </div>
                  
                  {/* Need Help */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Need Help?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Our support team is here to assist you
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link href="/contact">
                        <Button variant="primary" leftIcon={<Mail className="w-4 h-4" />}>
                          Contact Support
                        </Button>
                      </Link>
                      <a href="tel:+15551234567">
                        <Button variant="outline" leftIcon={<Phone className="w-4 h-4" />}>
                          Call Us
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      
    </>
  );
}