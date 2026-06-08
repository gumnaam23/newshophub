'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw,
  Shield,
  LucideIcon,
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'seller';
  avatar?: string;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
}

interface StatCard {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}



export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    user: 0,
    seller: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [currentPage, searchTerm, selectedRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      if (searchTerm) params.append('search', searchTerm);
      if (selectedRole !== 'all') params.append('role', selectedRole);
      
      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pagination.pages);
        setTotalUsers(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/users/stats');
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
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await fetchUsers();
        await fetchStats();
        setShowDeleteModal(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Admin</span>;
      case 'seller':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Seller</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">User</span>;
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

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your store users and their roles
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.total} icon={Users} color="from-blue-500 to-blue-600" />
        <StatCard title="Admins" value={stats.admin} icon={Shield} color="from-purple-500 to-purple-600" />
        <StatCard title="Sellers" value={stats.seller} icon={UserCheck} color="from-green-500 to-green-600" />
        <StatCard title="Regular Users" value={stats.user} icon={UserX} color="from-gray-500 to-gray-600" />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="seller">Sellers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence mode="wait">
                {users.map((user, idx) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || '/api/placeholder/40/40'}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                      </div>
                     </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                     </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                     </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.ordersCount || 0}
                     </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      ${(user.totalSpent || 0).toFixed(2)}
                     </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                     </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/users/${user._id}`}>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="View">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                        </Link>
                        <Link href={`/admin/users/${user._id}/edit`}>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-blue-500" />
                          </button>
                        </Link>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => setShowDeleteModal(user._id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </div>
                     </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No users found</p>
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
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalUsers)} of {totalUsers} users
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete User</h3>
                  <p className="text-sm text-gray-500">Are you sure you want to delete this user?</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. The user will be permanently removed.
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
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}