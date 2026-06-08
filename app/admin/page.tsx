'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Download,
  RefreshCw,
  BarChart3,
  LucideIcon
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  usersChange: number;
  recentOrders: {
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    user: { name: string };
  }[];
  topProducts: {
    _id: string;
    name: string;
    soldCount: number;
    revenue: number;
    image: string;
  }[];
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    avatar?: string;
  }[];
  lowStockProducts: {
    _id: string;
    name: string;
    stock: number;
    image: string;
  }[];
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  change?: number;
  color: string;
  prefix?: string;
  suffix?: string;
  timeRange?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/dashboard?range=${timeRange}`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, color, prefix = '', suffix = '' }: StatCardProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change)}% from last {timeRange}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
           {` Welcome back! Here's what's happening with your store today.`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm">Export Report</span>
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'week', label: 'This Week' },
          { value: 'month', label: 'This Month' },
          { value: 'year', label: 'This Year' }
        ].map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value as 'week' | 'month' | 'year')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeRange === range.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={stats?.totalRevenue || 0}
          icon={DollarSign}
          change={stats?.revenueChange}
          color="from-green-500 to-green-600"
          prefix="$"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          change={stats?.ordersChange}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          change={stats?.productsChange}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          change={stats?.usersChange}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Overview
            </h3>
            <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-80 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Revenue chart will be displayed here</p>
              <p className="text-sm">(Integration with recharts or chart.js)</p>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Orders Overview
            </h3>
            <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-80 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Orders chart will be displayed here</p>
              <p className="text-sm">(Integration with recharts or chart.js)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Orders
              </h3>
              <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats?.recentOrders?.map((order, idx) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order._id}`} className="font-mono text-sm text-blue-600 hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {order.user?.name || 'Guest'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Products
              </h3>
              <Link href="/admin/products" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats?.topProducts?.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image || '/api/placeholder/50/50'}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <Link href={`/admin/products/${product._id}/edit`}>
                      <h4 className="font-medium text-gray-900 dark:text-white hover:text-blue-600">
                        {product.name}
                      </h4>
                    </Link>
                    <p className="text-sm text-gray-500">Sold: {product.soldCount} units</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                       ${(product.revenue || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {(!stats?.topProducts || stats.topProducts.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                No products data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Users & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Users
              </h3>
              <Link href="/admin/users" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats?.recentUsers?.map((user, idx) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || '/api/placeholder/40/40'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                No users found
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Low Stock Products
              </h3>
              <Link href="/admin/products?filter=low-stock" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats?.lowStockProducts?.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image || '/api/placeholder/50/50'}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <Link href={`/admin/products/${product._id}/edit`}>
                      <h4 className="font-medium text-gray-900 dark:text-white hover:text-blue-600">
                        {product.name}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${Math.min(100, (product.stock / 20) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        Only {product.stock} left
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {(!stats?.lowStockProducts || stats.lowStockProducts.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                No low stock products
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}