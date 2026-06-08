'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  User,
  Loader2,
  AlertCircle,
  Send
} from 'lucide-react';

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
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  trackingNumber?: string;
  carrier?: string;
  adminNotes?: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
        setSelectedStatus(data.data.status);
        setTrackingNumber(data.data.trackingNumber || '');
        setCarrier(data.data.carrier || '');
        setAdminNotes(data.data.adminNotes || '');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return;
    
    setUpdating(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          trackingNumber,
          carrier,
          notes: adminNotes
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Order status updated to ${selectedStatus}`);
        fetchOrder();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update order');
      }
    } catch (error) {
      console.error(error)
      setError('Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'processing': return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'delivered': return 'bg-green-100 text-green-800';
  //     case 'shipped': return 'bg-purple-100 text-purple-800';
  //     case 'processing': return 'bg-blue-100 text-blue-800';
  //     case 'pending': return 'bg-yellow-100 text-yellow-800';
  //     case 'cancelled': return 'bg-red-100 text-red-800';
  //     default: return 'bg-gray-100 text-gray-800';
  //   }
  // };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{`The order you're looking for doesn't exist.`}</p>
        <Link href="/admin/orders">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Back to Orders</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Order #{order.orderNumber}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Price: ${item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{order.user?.name || 'Guest'}</p>
                  <p className="text-sm text-gray-500">Customer Name</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{order.user?.email}</p>
                  <p className="text-sm text-gray-500">Email Address</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.phone || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Phone Number</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Order Date</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Address</h2>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Information</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Update Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Order Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              {selectedStatus === 'shipped' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Carrier</label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    >
                      <option value="">Select Carrier</option>
                      <option value="USPS">USPS</option>
                      <option value="FedEx">FedEx</option>
                      <option value="UPS">UPS</option>
                      <option value="DHL">DHL</option>
                    </select>
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Admin Notes</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="Add internal notes..."
                />
              </div>
              
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Update Order
              </button>
            </div>
          </div>

          {/* Current Status Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Status</h2>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {getStatusIcon(order.status)}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </p>
                <p className="text-xs text-gray-500">Updated {new Date(order.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}