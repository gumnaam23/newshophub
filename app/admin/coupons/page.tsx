'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Tag,
  Gift,
  DollarSign,
  Percent,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Copy,
  Clock,
  LucideIcon
} from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
  createdAt: string;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    totalSavings: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await fetch(`/api/admin/coupons?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setCoupons(data.data);
        setTotalPages(data.pagination.pages);
        setTotalCoupons(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/coupons/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/coupons/${id}/delete`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Coupon deleted successfully');
        await fetchCoupons();
        await fetchStats();
        setShowDeleteModal(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete coupon');
      }
    } catch (error) {
      console.error(error)
      setError('Failed to delete coupon');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await response.json();
      if (data.success) {
        await fetchCoupons();
        setSuccess(`Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error(error)
      setError('Failed to update coupon status');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getStatusBadge = (coupon: Coupon) => {
    if (!coupon.isActive) {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Inactive</span>;
    }
    if (isExpired(coupon.endDate)) {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">Expired</span>;
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">Used Up</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">Active</span>;
  };

  const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
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

  if (loading && coupons.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupons</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage discount coupons and promotional codes
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCoupons}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Link href="/admin/coupons/add">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Coupon
            </button>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Coupons" value={stats.total} icon={Tag} color="from-blue-500 to-blue-600" />
        <StatCard title="Active Coupons" value={stats.active} icon={Gift} color="from-green-500 to-green-600" />
        <StatCard title="Expired Coupons" value={stats.expired} icon={Clock} color="from-red-500 to-red-600" />
        <StatCard title="Total Savings" value={`$${stats.totalSavings.toLocaleString()}`} icon={DollarSign} color="from-purple-500 to-purple-600" />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by coupon code..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Coupons Grid */}
      {coupons.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No coupons found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first coupon'}
          </p>
          {!searchTerm && (
            <Link href="/admin/coupons/add">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Coupon
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {coupons.map((coupon, idx) => (
            <motion.div
              key={coupon._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                      {coupon.type === 'percentage' ? (
                        <Percent className="w-5 h-5 text-white" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {coupon.code}
                        </h3>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                          title="Copy code"
                        >
                          <Copy className="w-3 h-3 text-gray-400" />
                        </button>
                        {copiedCode === coupon.code && (
                          <span className="text-xs text-green-500">Copied!</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{coupon.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(coupon)}
                </div>

                {/* Discount Info */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                    </span>
                    <span className="text-sm text-gray-500">OFF</span>
                  </div>
                  {coupon.minPurchase > 0 && (
                    <p className="text-sm text-gray-500">Minimum purchase: ${coupon.minPurchase}</p>
                  )}
                  {coupon.maxDiscount && coupon.type === 'percentage' && (
                    <p className="text-sm text-gray-500">Max discount: ${coupon.maxDiscount}</p>
                  )}
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Used / Limit</p>
                    <p className="text-sm font-semibold">{coupon.usedCount} / {coupon.usageLimit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Per User Limit</p>
                    <p className="text-sm font-semibold">{coupon.perUserLimit}</p>
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Link href={`/admin/coupons/${coupon._id}/edit`}>
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-blue-500" />
                      </button>
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(coupon._id)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
                    className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                      coupon.isActive
                        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalCoupons)} of {totalCoupons} coupons
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Coupon</h3>
                  <p className="text-sm text-gray-500">Are you sure you want to delete this coupon?</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. The coupon code will no longer be usable.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Coupon'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}