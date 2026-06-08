'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Star,
    Settings,
    BarChart3,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Bell,
    Search,
    Sun,
    Moon,
    Gift,
    FolderTree,
    Shield,
    LucideIcon
} from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
    badge?: number;
    submenu?: { name: string; href: string }[];
}

interface Notification {
    id: number;
    message: string;
    time: string;
    read: boolean;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('adminDarkMode') === 'true';
        }
        return false;
    });
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [notifications] = useState<Notification[]>([
        { id: 1, message: 'New order received', time: '5 min ago', read: false },
        { id: 2, message: 'Product out of stock', time: '1 hour ago', read: false },
        { id: 3, message: 'New user registered', time: '3 hours ago', read: true },
    ]);
    const [showNotifications, setShowNotifications] = useState(false);

    const navItems: NavItem[] = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, badge: 12 },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Categories', href: '/admin/categories', icon: FolderTree },
        { name: 'Coupons', href: '/admin/coupons', icon: Gift },
        { name: 'Reviews', href: '/admin/reviews', icon: Star, badge: 5 },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }

        if (session?.user?.role !== 'admin') {
            router.push('/');
        }

    }, [status, session, router]);

    // ✅ Fixed: Remove setState from useEffect - only sync DOM
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
        localStorage.setItem('adminDarkMode', String(newDarkMode));
    };

    const toggleMenu = (menuName: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuName)
                ? prev.filter(m => m !== menuName)
                : [...prev, menuName]
        );
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (session?.user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: sidebarOpen ? 0 : -280 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 left-0 z-30 w-72 h-full bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
            >
                {/* Logo */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <Link href="/admin" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Admin Panel
                                </span>
                                <p className="text-xs text-gray-500">Version 1.0.0</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                                <Image
                                    src={session?.user?.avatar || '/api/placeholder/50/50'}
                                    alt={session?.user?.name || 'Admin'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {session?.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Administrator
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;
                        const hasSubmenu = item.submenu && item.submenu.length > 0;
                        const isExpanded = expandedMenus.includes(item.name);

                        return (
                            <div key={item.name}>
                                {hasSubmenu ? (
                                    <>
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isActive
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-5 h-5" />
                                                <span>{item.name}</span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="ml-8 mt-1 space-y-1 overflow-hidden"
                                                >
                                                    {item.submenu?.map((sub) => (
                                                        <Link
                                                            key={sub.href}
                                                            href={sub.href}
                                                            className={`block px-4 py-2 rounded-lg text-sm transition-all ${pathname === sub.href
                                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                }`}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5" />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.badge && (
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isActive
                                                ? 'bg-white/20 text-white'
                                                : 'bg-red-500 text-white'
                                                }`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer Links */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Back to Store</span>
                    </Link>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : ''}`}>
                {/* Header */}
                <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center justify-between px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>

                            {/* Breadcrumb */}
                            {/* Breadcrumb */}
                            <div className="hidden md:flex items-center gap-2 text-sm">
                                <span className="text-gray-500">Admin</span>
                                {pathname !== '/admin' && (
                                    <>
                                        <span className="text-gray-400">/</span>
                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {(() => {
                                                const lastSegment = pathname.split('/').pop();
                                                if (!lastSegment) return '';
                                                return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
                                            })()}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 min-w-[250px]">
                                <Search className="w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none focus:outline-none px-2 text-sm w-full text-gray-700 dark:text-gray-300"
                                />
                                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-200 dark:bg-gray-600 rounded">
                                    ⌘K
                                </kbd>
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                                        >
                                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold">Notifications</h3>
                                                    <button className="text-xs text-blue-600">Mark all as read</button>
                                                </div>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                                            }`}
                                                    >
                                                        <p className="text-sm text-gray-900 dark:text-white">{notif.message}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-3 text-center">
                                                <button className="text-sm text-blue-600">View all notifications</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Admin Profile Dropdown */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                    <Image
                                        src={session?.user?.avatar || '/api/placeholder/40/40'}
                                        alt={session?.user?.name || 'Admin'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {session?.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}