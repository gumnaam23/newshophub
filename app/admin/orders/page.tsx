'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Download,
  Calendar,
  DollarSign,
  ShoppingBag,
  LucideIcon
} from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface StatCard {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [currentPage, searchTerm, selectedStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      if (searchTerm) params.append('search', searchTerm);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
        setTotalPages(data.pagination.pages);
        setTotalOrders(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/orders/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      processing: { icon: RefreshCw, color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      shipped: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Delivered' },
      cancelled: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const StatCard = ({ title, value, icon: Icon, color }: StatCard) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} color="from-green-500 to-green-600" />
        <StatCard title="Total Orders" value={stats.pending + stats.processing + stats.shipped + stats.delivered + stats.cancelled} icon={ShoppingBag} color="from-blue-500 to-blue-600" />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="from-yellow-500 to-yellow-600" />
        <StatCard title="Processing" value={stats.processing} icon={RefreshCw} color="from-blue-500 to-blue-600" />
        <StatCard title="Shipped" value={stats.shipped} icon={Truck} color="from-purple-500 to-purple-600" />
        <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle} color="from-green-500 to-green-600" />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or customer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence mode="wait">
                {orders.map((order, idx) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order._id}`}>
                          <span className="font-mono text-sm text-blue-600 hover:underline">
                            {order.orderNumber}
                          </span>
                        </Link>
                       </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{order.user?.name || 'Guest'}</p>
                          <p className="text-xs text-gray-500">{order.user?.email}</p>
                        </div>
                       </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                       </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {order.items.length} items
                       </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${order.total.toFixed(2)}
                        </span>
                       </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                       </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/orders/${order._id}`}>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="View Details">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                        </Link>
                       </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No orders found</p>
                   </td>
                </tr>
              )}
            </tbody>
           </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalOrders)} of {totalOrders} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 rounded-lg bg-blue-600 text-white">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}