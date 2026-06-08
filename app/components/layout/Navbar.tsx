'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ShoppingCart, Search, Heart, ChevronDown,
  Sun, Moon, Package, Gift, Tag, TrendingUp, Sparkles,
  Star, Home, ShoppingBag, LayoutGrid, Info, Phone, Mail,
} from 'lucide-react';
import { UserMenu } from './UserMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Lazy initialization - no setState in effect
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  // Categories dropdown data
  const categories = [
    { name: 'Electronics', href: '/products?category=electronics', icon: <LayoutGrid className="w-4 h-4" />, subcategories: ['Smartphones', 'Laptops', 'Cameras', 'Audio'] },
    { name: 'Fashion', href: '/products?category=fashion', icon: <ShoppingBag className="w-4 h-4" />, subcategories: ['Men', 'Women', 'Kids', 'Accessories'] },
    { name: 'Home & Living', href: '/products?category=home', icon: <Home className="w-4 h-4" />, subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding'] },
    { name: 'Books', href: '/products?category=books', icon: <Star className="w-4 h-4" />, subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Comics'] },
  ];

  // Navigation links
  const navLinks = [
    { name: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Shop', href: '/products', icon: <ShoppingBag className="w-4 h-4" />, dropdown: categories },
    { name: 'Deals', href: '/products?deals=true', icon: <Tag className="w-4 h-4" /> },
    { name: 'New Arrivals', href: '/products?isNew=true', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Best Sellers', href: '/products?rating=4.5', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'About', href: '/about', icon: <Info className="w-4 h-4" /> },
    { name: 'Contact', href: '/contact', icon: <Phone className="w-4 h-4" /> },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dark mode - Only sync DOM when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Top Bar - Tailwind v4 gradient syntax */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm py-2"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>+1 234 567 890</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>support@shophub.com</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mx-auto md:mx-0">
              <div className="flex items-center gap-1">
                <Gift className="w-3 h-3" />
                <span>Free Shipping on orders over $50</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/track-order" className="hover:underline flex items-center gap-1">
                <Package className="w-3 h-3" />
                Track Order
              </Link>
              <Link href="/help" className="hover:underline flex items-center gap-1">
                <Info className="w-3 h-3" />
                Help
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navbar - Tailwind v4 backdrop blur */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
            : 'bg-white dark:bg-gray-900 shadow-md'
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopHub
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.dropdown ? (
                    <div className="relative">
                      <button className="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg">
                        {link.icon}
                        <span>{link.name}</span>
                        <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                      </button>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
                      >
                        <div className="p-4">
                          {link.dropdown.map((category) => (
                            <div key={category.name} className="mb-4">
                              <Link
                                href={category.href}
                                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                {category.icon}
                                <span className="font-medium">{category.name}</span>
                              </Link>
                              <div className="pl-8 mt-1">
                                {category.subcategories.map((sub) => (
                                  <Link
                                    key={sub}
                                    href="#"
                                    className="block px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                  >
                                    {sub}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${pathname === link.href
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Wishlist */}
              <Link href="/account/wishlist">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* User Menu Button */}
              <UserMenu />

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.dropdown ? (
                      <div className="py-2">
                        <div className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            {link.icon}
                            <span>{link.name}</span>
                          </div>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                        <div className="pl-8 mt-1 space-y-1">
                          {link.dropdown.map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${pathname === link.href
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                <form onSubmit={handleSearch} className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-900 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                </form>
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Popular Searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Laptop', 'Phone', 'Shoes', 'Watch', 'Headphones'].map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          window.location.href = `/products?search=${encodeURIComponent(term)}`;
                        }}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;