'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    CreditCard,
    Shield,
    Truck,
    RefreshCw,
    Headphones,
    Apple,
    Smartphone,
    Laptop,
    Shirt,
    Home,
    Book,
    Gift,
    Heart,
    ShoppingBag,
    Star,
    Lock,
    Clock,
    Package,
    Truck as TruckIcon,
    DollarSign,
    Zap,
    CheckCircle,
    AlertCircle,
    User
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import {
    FaFacebook as Facebook,
    FaTwitter as Twitter,
    FaInstagram as Instagram,
    FaYoutube as Youtube,
    FaLinkedin as Linkedin,
    FaGithub as Github,
} from 'react-icons/fa';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
        type: null,
        message: ''
    });
    const pathname = usePathname()

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setStatus({ type: 'error', message: 'Please enter your email address' });
            setTimeout(() => setStatus({ type: null, message: '' }), 3000);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus({ type: 'error', message: 'Please enter a valid email address' });
            setTimeout(() => setStatus({ type: null, message: '' }), 3000);
            return;
        }

        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name || undefined,
                    email,
                    source: 'footer',
                    preferences: {
                        promotions: true,
                        newArrivals: true,
                        deals: true
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                setStatus({ type: 'success', message: data.message || 'Successfully subscribed!' });
                setName('');
                setEmail('');
                setTimeout(() => setStatus({ type: null, message: '' }), 3000);
            } else {
                setStatus({ type: 'error', message: data.error || 'Subscription failed. Please try again.' });
                setTimeout(() => setStatus({ type: null, message: '' }), 3000);
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error. Please try again.' });
            setTimeout(() => setStatus({ type: null, message: '' }), 3000);
        } finally {
            setLoading(false);
        }
    };


    const quickLinks = [
        { name: 'About Us', href: '/about', icon: <Star className="w-4 h-4" /> },
        { name: 'Contact Us', href: '/contact', icon: <Phone className="w-4 h-4" /> },
        { name: 'FAQs', href: '/faqs', icon: <Headphones className="w-4 h-4" /> },
        { name: 'Shipping Info', href: '/shipping', icon: <Truck className="w-4 h-4" /> },
        { name: 'Returns Policy', href: '/returns', icon: <RefreshCw className="w-4 h-4" /> },
        { name: 'Privacy Policy', href: '/privacy', icon: <Lock className="w-4 h-4" /> },
        { name: 'Terms of Service', href: '/terms', icon: <Shield className="w-4 h-4" /> },
        { name: 'Track Order', href: '/track-order', icon: <Package className="w-4 h-4" /> },
    ];

    const categories = [
        { name: 'Electronics', href: '/products?category=electronics', icon: <Laptop className="w-4 h-4" /> },
        { name: 'Fashion', href: '/products?category=fashion', icon: <Shirt className="w-4 h-4" /> },
        { name: 'Home & Living', href: '/products?category=home', icon: <Home className="w-4 h-4" /> },
        { name: 'Books', href: '/products?category=books', icon: <Book className="w-4 h-4" /> },
        { name: 'Sports', href: '/products?category=sports', icon: <Zap className="w-4 h-4" /> },
        { name: 'Toys', href: '/products?category=toys', icon: <Gift className="w-4 h-4" /> },
    ];

    const accountLinks = [
        { name: 'My Account', href: '/account', icon: <ShoppingBag className="w-4 h-4" /> },
        { name: 'Order History', href: '/account/orders', icon: <Clock className="w-4 h-4" /> },
        { name: 'Wishlist', href: '/account/wishlist', icon: <Heart className="w-4 h-4" /> },
        { name: 'Addresses', href: '/account/addresses', icon: <MapPin className="w-4 h-4" /> },
        { name: 'Saved Cards', href: '/account/payment', icon: <CreditCard className="w-4 h-4" /> },
        { name: 'Newsletter', href: '/newsletter', icon: <Send className="w-4 h-4" /> },
    ];

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', color: 'hover:bg-[#1877f2]' },
        { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: 'hover:bg-[#1da1f2]' },
        { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', color: 'hover:bg-gradient-to-r from-[#833ab4] to-[#fd1d1d]' },
        { name: 'Youtube', icon: Youtube, href: 'https://youtube.com', color: 'hover:bg-[#ff0000]' },
        { name: 'Linkedin', icon: Linkedin, href: 'https://linkedin.com', color: 'hover:bg-[#0077b5]' },
        { name: 'Github', icon: Github, href: 'https://github.com', color: 'hover:bg-[#333]' },
    ];

    const paymentMethods = [
        { name: 'Visa', icon: CreditCard },
        { name: 'Mastercard', icon: CreditCard },
        { name: 'PayPal', icon: DollarSign },
        { name: 'Apple Pay', icon: Apple },
        { name: 'Google Pay', icon: Smartphone },
        { name: 'American Express', icon: CreditCard },
    ];

    const features = [
        { icon: TruckIcon, title: 'Free Shipping', description: 'On orders over $50' },
        { icon: Shield, title: 'Secure Payment', description: '100% secure transactions' },
        { icon: RefreshCw, title: '30 Day Returns', description: 'Easy returns policy' },
        { icon: Headphones, title: '24/7 Support', description: 'Dedicated support team' },
    ];

      if(pathname.startsWith('/admin')) return null;

    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white">
            {/* Newsletter Section */}
            <div className="border-b border-gray-800">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-2xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Subscribe to Our Newsletter
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Get the latest updates on new products and upcoming sales
                            </p>

                            {status.type && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-4 p-3 rounded-lg flex items-center justify-center gap-2 ${status.type === 'success'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                        }`}
                                >
                                    {status.type === 'success' ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5" />
                                    )}
                                    <span>{status.message}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name (optional)"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email *"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        isLoading={loading}
                                        rightIcon={<Send className="w-4 h-4" />}
                                        className="whitespace-nowrap"
                                    >
                                        Subscribe
                                    </Button>
                                </div>
                            </form>

                            <p className="text-xs text-gray-500 mt-4">
                                By subscribing, you agree to our Privacy Policy and consent to receive updates
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                ShopHub
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                            Your one-stop destination for quality products at unbeatable prices.
                            We bring you the best selection of electronics, fashion, home goods, and more.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span>123 Commerce Street, New York, NY 10001</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                <span>support@shophub.com</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm group"
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            {link.icon}
                                        </span>
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Categories */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="text-lg font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.name}>
                                    <Link
                                        href={category.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm group"
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            {category.icon}
                                        </span>
                                        <span>{category.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Account */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="text-lg font-semibold mb-4">My Account</h4>
                        <ul className="space-y-2">
                            {accountLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm group"
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            {link.icon}
                                        </span>
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Features & Social */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <h4 className="text-lg font-semibold mb-4">Features</h4>
                        <div className="space-y-3 mb-6">
                            {features.map((feature) => (
                                <div key={feature.title} className="flex items-center gap-2 text-gray-400 text-sm">
                                    <feature.icon className="w-4 h-4 text-blue-400" />
                                    <div>
                                        <p className="font-medium text-white">{feature.title}</p>
                                        <p className="text-xs">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
                        <div className="flex gap-2">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 ${social.color}`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Payment Methods */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="border-t border-gray-800 mt-8 pt-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm">Secure Payments:</span>
                            <div className="flex gap-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.name}
                                        className="bg-gray-800 px-3 py-1 rounded-md flex items-center gap-2"
                                    >
                                        <method.icon className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs text-gray-400">{method.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-gray-400">100% Secure & Safe Transactions</span>
                        </div>
                    </div>
                </motion.div>

                {/* Copyright */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="border-t border-gray-800 mt-8 pt-8 text-center"
                >
                    <p className="text-gray-500 text-sm">
                        &copy; {currentYear} ShopHub. All rights reserved. | Designed with{' '}
                        <Heart className="w-3 h-3 inline text-red-500" /> for better shopping experience
                    </p>
                    <div className="flex justify-center gap-4 mt-2">
                        <Link href="/privacy" className="text-gray-500 hover:text-gray-400 text-xs">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-gray-500 hover:text-gray-400 text-xs">
                            Terms of Service
                        </Link>
                        <Link href="/cookies" className="text-gray-500 hover:text-gray-400 text-xs">
                            Cookie Policy
                        </Link>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;