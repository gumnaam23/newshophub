'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, LogOut, Settings, Package, Heart } from 'lucide-react';

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Link href="/auth/login">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <User className="w-4 h-4" />
          Sign In
        </button>
      </Link>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <img
          src={session.user.avatar || '/default-avatar.png'}
          alt={session.user.name}
          className="w-6 h-6 rounded-full"
        />
        <span>{session.user.name}</span>
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
      >
        <div className="py-2">
          <Link href="/account" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <User className="w-4 h-4" />
            My Account
          </Link>
          <Link href="/account/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Package className="w-4 h-4" />
            Orders
          </Link>
          <Link href="/account/wishlist" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Heart className="w-4 h-4" />
            Wishlist
          </Link>
          <Link href="/account/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <hr className="my-2" />
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}