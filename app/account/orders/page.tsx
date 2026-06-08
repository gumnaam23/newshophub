'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  Calendar,
  DollarSign,
  ChevronDown,
  Eye,
  Star,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    fetchOrders();
  }, [session, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
        setFilteredOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
    }
    
    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm, dateRange]);

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Pending' },
      processing: { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Processing' },
      shipped: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', label: 'Shipped' },
      delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Delivered' },
      cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Cancelled' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPaymentStatusConfig = (status: string) => {
    const configs = {
      pending: { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Pending' },
      paid: { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Paid' },
      failed: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Failed' }
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

  const OrderCard = ({ order, index }: { order: Order; index: number }) => {
    const [isExpanded, setIsExpanded] = useState(expandedOrder === order._id);
    const StatusIcon = getStatusConfig(order.status).icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Order Header */}
        <div 
          className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          onClick={() => {
            setIsExpanded(!isExpanded);
            setExpandedOrder(isExpanded ? null : order._id);
          }}
        >
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Order #{order.orderNumber}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(order.status).bg} ${getStatusConfig(order.status).color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {getStatusConfig(order.status).label}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusConfig(order.paymentStatus).bg} ${getPaymentStatusConfig(order.paymentStatus).color}`}>
                  <DollarSign className="w-3 h-3" />
                  {getPaymentStatusConfig(order.paymentStatus).label}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(order.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${order.total.toFixed(2)}
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mt-1">
                {isExpanded ? 'Hide Details' : 'View Details'}
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Order Details Expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
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
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.price} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Shipping Address
                  </h3>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link href={`/account/orders/${order._id}`}>
                    <Button variant="primary" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                      View Full Details
                    </Button>
                  </Link>
                  {order.status === 'delivered' && (
                    <Button variant="outline" size="sm" leftIcon={<Star className="w-4 h-4" />}>
                      Write a Review
                    </Button>
                  )}
                  <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                    Download Invoice
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Stats Cards
  const OrderStats = () => {
    const stats = {
      total: orders.length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      processing: orders.filter(o => o.status === 'processing').length,
      totalSpent: orders.reduce((sum, o) => sum + o.total, 0)
    };
    
    const statCards = [
      { label: 'Total Orders', value: stats.total, icon: Package, color: 'from-blue-500 to-blue-600' },
      { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'from-green-500 to-green-600' },
      { label: 'Processing', value: stats.processing, icon: RefreshCw, color: 'from-yellow-500 to-yellow-600' },
      { label: 'Total Spent', value: `$${stats.totalSpent.toFixed(2)}`, icon: DollarSign, color: 'from-purple-500 to-purple-600' }
    ];
    
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
          >
            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} mb-3`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
          </motion.div>
        ))}
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
          {/* Header */}
          <div className="mb-6">
            <Link href="/account" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and manage all your orders
            </p>
          </div>
          
          {/* Stats */}
          <OrderStats />
          
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order # or product"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              {/* Date Range Filter */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as 'all' | 'week' | 'month' | 'year')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
              
              {/* Clear Filters */}
              {(statusFilter !== 'all' || searchTerm || dateRange !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchTerm('');
                    setDateRange('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
          
          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
              <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {orders.length === 0 
                  ? "You haven't placed any orders yet"
                  : "No orders match your filters"}
              </p>
              {orders.length === 0 && (
                <Link href="/products">
                  <Button variant="primary">Start Shopping</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, idx) => (
                <OrderCard key={order._id} order={order} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
      
    </>
  );
}