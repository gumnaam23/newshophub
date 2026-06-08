'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Calendar,
  ShoppingBag,
  DollarSign,
  MapPin,
  Heart,
  Loader2,
  Edit
} from 'lucide-react';

interface UserDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  wishlistCount: number;
  addressesCount: number;
  recentOrders: {
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
}

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = await response.json();
      if (data.success) {
        setUser({
          ...data.data,
          totalSpent: data.data.totalSpent || 0, 
          ordersCount: data.data.ordersCount || 0,
          wishlistCount: data.data.wishlistCount || 0,
          addressesCount: data.data.addressesCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{`The user you're looking for doesn't exist.`}</p>
        <Link href="/admin/users">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Back to Users</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Details</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage user information</p>
          </div>
        </div>
        <Link href={`/admin/users/${user._id}/edit`}>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Edit className="w-4 h-4" />
            Edit User
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <img
              src={user.avatar || '/api/placeholder/120/120'}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-3">{user.email}</p>
            <div className="inline-block mb-4">{getRoleBadge(user.role)}</div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
              <ShoppingBag className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.ordersCount}</p>
              <p className="text-sm text-gray-500">Orders</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
              <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${user.totalSpent.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Total Spent</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.wishlistCount}</p>
              <p className="text-sm text-gray-500">Wishlist Items</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
              <MapPin className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.addressesCount}</p>
              <p className="text-sm text-gray-500">Addresses</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
            {user.recentOrders && user.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {user.recentOrders.map((order) => (
                  <Link key={order._id} href={`/admin/orders/${order._id}`}>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div>
                        <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
              </div>
            )}
            <div className="mt-4 text-center">
              <Link href={`/admin/orders?search=${user.email}`}>
                <button className="text-blue-600 hover:text-blue-700 text-sm">View All Orders →</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}