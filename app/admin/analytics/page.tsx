'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
  Award,
  UserCheck,
  Package,
  Tag,
} from 'lucide-react';

interface AnalyticsData {
  revenue: { total: number; change: number };
  orders: { total: number; change: number };
  users: { total: number; change: number };
  conversion: { rate: number; change: number };
  topProducts: Array<{ _id: string; name: string; soldCount: number; revenue: number; image?: string }>;
  topCategories: Array<{ name: string; count: number; revenue: number }>;
  customerInsights: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    returningCustomerRate: number;
    averageOrderValue: number;
  };
}

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  prefix?: string;
  suffix?: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, prefix = '', suffix = '' }: StatCardProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
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
                {Math.abs(change).toFixed(1)}% from last {period}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your store performance and customer insights
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2">
          {[
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'year', label: 'This Year' }
          ].map((p) => {

           return (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as 'week' | 'month' | 'year')}
              className={`px-4 py-2 rounded-lg transition-all ${
                period === p.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          )
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={data?.revenue.total || 0}
          change={data?.revenue.change}
          icon={DollarSign}
          color="from-green-500 to-green-600"
          prefix="$"
        />
        <StatCard
          title="Total Orders"
          value={data?.orders.total || 0}
          change={data?.orders.change}
          icon={ShoppingBag}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Users"
          value={data?.users.total || 0}
          change={data?.users.change}
          icon={Users}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Conversion Rate"
          value={data?.conversion.rate || 0}
          change={data?.conversion.change}
          icon={TrendingUp}
          color="from-orange-500 to-orange-600"
          suffix="%"
        />
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Customer Insights
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Total Customers</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {data?.customerInsights.totalCustomers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">New Customers ({period})</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {data?.customerInsights.newCustomers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Returning Customers</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {data?.customerInsights.returningCustomers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Returning Customer Rate</span>
              <span className="font-semibold text-green-600">
                {data?.customerInsights.returningCustomerRate || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Order Value</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${(data?.customerInsights.averageOrderValue || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Categories
            </h3>
          </div>
          <div className="space-y-4">
            {data?.topCategories?.map((category, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ${category.revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(category.revenue / (data?.topCategories?.[0]?.revenue || 1)) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{category.count} products</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Products
            </h3>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data?.topProducts?.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
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
        </div>
      </div>
    </div>
  );
}