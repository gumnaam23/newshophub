'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Tag,
  Star,
  TrendingUp,
  Archive,
  RefreshCw,
  LucideIcon
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  isFeatured: boolean;
  isNewProduct: boolean;
  createdAt: string;
}

interface StatCard {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}


export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    outOfStock: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchStats();
  }, [currentPage, searchTerm, selectedCategory, selectedStatus]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const response = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.pages);
        setTotalProducts(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {


    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (data.success) {
        const categoryName: string[] = data.data
          .map((c: { name: string }) => c.name)
          .filter((name: string, index: number, arr: string[]) => arr.indexOf(name) === index);
        setCategories(categoryName);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/products/stats');
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
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await fetchProducts();
        await fetchStats();
        setShowDeleteModal(null);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-100', icon: XCircle };
    if (stock < 10) return { label: 'Low Stock', color: 'text-yellow-600 bg-yellow-100', icon: AlertCircle };
    return { label: 'In Stock', color: 'text-green-600 bg-green-100', icon: CheckCircle };
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

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your product catalog
          </p>
        </div>
        <Link href="/admin/products/add">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Products" value={stats.totalProducts} icon={Package} color="from-blue-500 to-blue-600" />
        <StatCard title="Total Stock" value={stats.totalStock} icon={Archive} color="from-green-500 to-green-600" />
        <StatCard title="Low Stock Items" value={stats.lowStock} icon={AlertCircle} color="from-yellow-500 to-yellow-600" />
        <StatCard title="Out of Stock" value={stats.outOfStock} icon={XCircle} color="from-red-500 to-red-600" />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => {
              fetchProducts();
              fetchStats();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence mode="wait">
                {products.map((product, idx) => {
                  const stockStatus = getStockStatus(product.stock);
                  const StockIcon = stockStatus.icon;

                  return (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || '/api/placeholder/50/50'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <Link href={`/admin/products/${product._id}/edit`}>
                              <p className="font-medium text-gray-900 dark:text-white hover:text-blue-600 line-clamp-1">
                                {product.name}
                              </p>
                            </Link>
                            <p className="text-xs text-gray-500">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          <Tag className="w-3 h-3" />
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">${product.price}</p>
                          {product.comparePrice > product.price && (
                            <p className="text-xs text-gray-500 line-through">${product.comparePrice}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          <StockIcon className="w-3 h-3" />
                          {stockStatus.label} ({product.stock})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">{product.soldCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating?.toFixed(1) || '0'}</span>
                          <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/products/${product._id}`} target="_blank">
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="View">
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                          </Link>
                          <Link href={`/admin/products/${product._id}/edit`}>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Edit">
                              <Edit className="w-4 h-4 text-blue-500" />
                            </button>
                          </Link>
                          <button
                            onClick={() => setShowDeleteModal(product._id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No products found</p>
                    <Link href="/admin/products/add">
                      <button className="mt-3 text-blue-600 hover:text-blue-700">Add your first product</button>
                    </Link>
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
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalProducts)} of {totalProducts} products
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Product</h3>
                  <p className="text-sm text-gray-500">Are you sure you want to delete this product?</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. The product will be permanently removed from your store.
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
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Product'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}