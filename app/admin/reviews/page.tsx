'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ThumbsUp,
  Trash2,
  CheckCircle,
  Search,
  RefreshCw,
  MessageSquare,
  User,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  LucideIcon,
  Clock
} from 'lucide-react';

interface Review {
  _id: string;
  productId: {
    _id: string;
    name: string;
    images: string[];
  };
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  isApproved: boolean;
  createdAt: string;
}

interface StatCard {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    averageRating: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await fetch(`/api/admin/reviews?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data);
        setTotalPages(data.pagination.pages);
        setTotalReviews(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/reviews/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}/approve`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Review approved successfully');
        await fetchReviews();
        await fetchStats();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error(error)
      setError('Failed to approve review');
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/reviews/${id}/delete`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Review deleted successfully');
        await fetchReviews();
        await fetchStats();
        setShowDeleteModal(null);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error(error)
      setError('Failed to delete review');
    } finally {
      setDeleting(false);
    }
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

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer reviews and ratings
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
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
        <StatCard title="Total Reviews" value={stats.total} icon={MessageSquare} color="from-blue-500 to-blue-600" />
        <StatCard title="Approved" value={stats.approved} icon={CheckCircle} color="from-green-500 to-green-600" />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="from-yellow-500 to-yellow-600" />
        <StatCard title="Avg Rating" value={stats.averageRating.toFixed(1)} icon={Star} color="from-purple-500 to-purple-600" />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product or customer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No reviews found</h3>
          <p className="text-gray-500">No reviews match your criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <Link href={`/admin/products/${review.productId?._id}/edit`} className="md:w-24">
                  <img
                    src={review.productId?.images?.[0] || '/api/placeholder/100/100'}
                    alt={review.productId?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                    <div>
                      <Link href={`/admin/products/${review.productId?._id}/edit`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600">
                          {review.productId?.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{review.rating}.0</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!review.isApproved && (
                        <button
                          onClick={() => handleApprove(review._id)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => setShowDeleteModal(review._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{review.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{review.comment}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{review.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{review.helpful} found helpful</span>
                    </div>
                    {!review.isApproved && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        Pending Approval
                      </span>
                    )}
                  </div>
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
            Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalReviews)} of {totalReviews} reviews
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Review</h3>
                  <p className="text-sm text-gray-500">Are you sure you want to delete this review?</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. The review will be permanently removed.
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
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Review'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

