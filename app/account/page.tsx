'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  ShoppingBag,
  Star,
  Clock,
  Truck,
  Shield,
  Gift,
  Award,
  ChevronRight,
  Loader2,
  MapPin as MapPinIcon,
  Headphones
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface UserData {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
  orders: Order[];
  wishlist: Product[];
  addresses: Address[];
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface Address {
  _id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function AccountDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    addressesCount: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const [userRes, ordersRes, statsRes] = await Promise.all([
            fetch('/api/user/profile'),
            fetch('/api/orders?limit=5'),
            fetch('/api/user/stats') 
          ]);

          const userData = await userRes.json();
          const ordersData = await ordersRes.json();
          const statsData = await statsRes.json();

          if (userData.success) {
            setUserData(userData.data);
          }

          if (ordersData.success) {
            setRecentOrders(ordersData.data);
          }

          // ✅ Calculate total spent from orders if stats API is not available
          let totalSpent = 0;
          if (statsData.success && statsData.data.totalSpent) {
            totalSpent = statsData.data.totalSpent;
          } else if (ordersData.success && ordersData.data.length > 0) {
            // Calculate from orders
            totalSpent = ordersData.data.reduce((sum: number, order: Order) => sum + order.total, 0);
          }

          setStats({
            totalOrders: statsData.data?.totalOrders || ordersData.data?.length || 0,
            totalSpent: totalSpent,
            wishlistCount: statsData.data?.wishlistCount || 0,
            addressesCount: statsData.data?.addressesCount || 0
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <Shield className="w-4 h-4" />;
      case 'cancelled':
        return <Package className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // Stats Cards
  const StatsCards = () => {
    const statCards = [
      {
        title: 'Total Orders',
        value: stats.totalOrders,
        icon: ShoppingBag,
        color: 'from-blue-500 to-blue-600',
        link: '/account/orders'
      },
      {
        title: 'Total Spent',
        value: `$${
          stats.totalSpent.toFixed(2) 
          }`,
        icon: CreditCard,
        color: 'from-green-500 to-green-600',
        link: '/account/orders'
      },
      {
        title: 'Wishlist',
        value: stats.wishlistCount,
        icon: Heart,
        color: 'from-red-500 to-red-600',
        link: '/account/wishlist'
      },
      {
        title: 'Addresses',
        value: stats.addressesCount,
        icon: MapPin,
        color: 'from-purple-500 to-purple-600',
        link: '/account/addresses'
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Link href={stat.link}>
              <div className="p-6">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  };

  // Welcome Banner
  const WelcomeBanner = () => {
    const memberSince = userData?.createdAt
      ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'recently';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 mb-8 text-white"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome back, {userData?.name?.split(' ')[0]}!
                </h1>
                <p className="text-white/80 text-sm">
                  Member since {memberSince}
                </p>
              </div>
            </div>
            <p className="text-white/90 mt-2">
              {userData?.role === 'admin' ? 'Admin Account' : 'Customer Account'}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/account/profile">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  // Recent Orders Section
  const RecentOrdersSection = () => {
    if (recentOrders.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start shopping to see your orders here
          </p>
          <Link href="/products">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <Link
              href="/account/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentOrders.map((order, idx) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      #{order.orderNumber}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${order.total.toFixed(2)}
                  </p>
                  <Link href={`/account/orders/${order._id}`}>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Quick Actions Section
  const QuickActions = () => {
    const actions = [
      { title: 'Profile Settings', icon: User, href: '/account/profile', color: 'bg-blue-100 text-blue-600' },
      { title: 'My Orders', icon: Package, href: '/account/orders', color: 'bg-green-100 text-green-600' },
      { title: 'Wishlist', icon: Heart, href: '/account/wishlist', color: 'bg-red-100 text-red-600' },
      { title: 'Addresses', icon: MapPin, href: '/account/addresses', color: 'bg-purple-100 text-purple-600' },
      { title: 'Payment Methods', icon: CreditCard, href: '/account/payment', color: 'bg-yellow-100 text-yellow-600' },
      { title: 'Support', icon: Headphones, href: '/contact', color: 'bg-orange-100 text-orange-600' }
    ];

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, idx) => (
            <Link key={idx} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
              >
                <div className={`inline-flex p-2 rounded-lg ${action.color} mb-3`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                  {action.title}
                </h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // Default Address Section
  const DefaultAddressSection = () => {
    const defaultAddress = userData?.addresses?.find(addr => addr.isDefault);

    if (!defaultAddress) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Default Address
            </h2>
            <Link href="/account/addresses">
              <Button variant="outline" size="sm">Manage</Button>
            </Link>
          </div>
          <div className="text-center py-6">
            <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              No address added yet
            </p>
            <Link href="/account/addresses/add">
              <Button variant="primary" size="sm" className="mt-3">
                Add Address
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Default Address
          </h2>
          <Link href="/account/addresses">
            <Button variant="outline" size="sm">Manage</Button>
          </Link>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-gray-900 dark:text-white">
            {defaultAddress.fullName}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {defaultAddress.street}<br />
            {defaultAddress.city}, {defaultAddress.state} {defaultAddress.zipCode}<br />
            {defaultAddress.country}
          </p>
        </div>
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
          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* Stats Cards */}
          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Recent Orders */}
            <div className="lg:col-span-2">
              <RecentOrdersSection />
            </div>

            {/* Right Column - Quick Actions & Address */}
            <div className="space-y-6">
              <QuickActions />
              <DefaultAddressSection />

              {/* Membership Benefits */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Member Benefits
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-green-500" />
                    Exclusive member-only deals
                  </li>
                  <li className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-500" />
                    Free shipping on orders over $50
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Earn points on every purchase
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-500" />
                    Priority customer support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

