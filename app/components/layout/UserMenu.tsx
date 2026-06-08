'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Settings,
  ChevronDown,
  CreditCard,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface UserMenuProps {
  className?: string;
}

export const UserMenu = ({ className = '' }: UserMenuProps) => {
  const { data: session, status } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  // Guest User (Not logged in)
  if (!session?.user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Link href="/auth/login">
          <Button variant="primary" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button variant="outline" size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  // Logged in user
  return (
    <div className={`relative ${className}`}>
      {/* User Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center gap-2 p-1 pr-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        {/* User Avatar */}
        {session.user.avatar  ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500">
            <Image
              src={session.user.avatar  || ''}
              alt={session.user.name || 'User'}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {session.user.name || session.user.email?.split('@')[0]}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {session.user.role || 'User'}
          </p>
        </div>
        
        <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 border border-gray-200 dark:border-gray-700"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {/* Large Avatar */}
                {session.user.avatar ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={session.user.avatar  || ''}
                      alt={session.user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {session.user.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {session.user.email}
                  </p>
                  {session.user.role && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full capitalize">
                      {session.user.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link href="/account" onClick={() => setIsUserMenuOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  <span>My Account</span>
                </div>
              </Link>
              
              <Link href="/account/orders" onClick={() => setIsUserMenuOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </div>
              </Link>
              
              <Link href="/account/wishlist" onClick={() => setIsUserMenuOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </div>
              </Link>
              
              <Link href="/account/addresses" onClick={() => setIsUserMenuOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span>Addresses</span>
                </div>
              </Link>

              <Link href="/account/payment" onClick={() => setIsUserMenuOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment Methods</span>
                </div>
              </Link>
              
              <Link href="/account/settings" onClick={() => setIsUserMenuOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </div>
              </Link>
            </div>

            {/* Divider and Sign Out */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};