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
  FolderTree,
  Package,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/admin/categories/${id}/delete`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Category deleted successfully');
        await fetchCategories();
        setShowDeleteModal(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error(error)
      setError('Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await response.json();
      if (data.success) {
        await fetchCategories();
        setSuccess(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error(error)
      setError('Failed to update category status');
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your product categories
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCategories}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Link href="/admin/categories/add">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Category
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

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No categories found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first category'}
          </p>
          {!searchTerm && (
            <Link href="/admin/categories/add">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Category
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, idx) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Category Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={category.image || '/api/placeholder/400/200'}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    category.isActive 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Package className="w-4 h-4" />
                    <span>{category.productCount}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Link href={`/admin/categories/${category._id}/edit`}>
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-blue-500" />
                      </button>
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(category._id)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(category._id, category.isActive)}
                    className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                      category.isActive
                        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    {category.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Category</h3>
                  <p className="text-sm text-gray-500">Are you sure you want to delete this category?</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. Products in this category will lose their category assignment.
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
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Category'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}