'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    CheckCircle,
    AlertCircle,
    MessageCircle,
    User,
    Building
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import {
    FaFacebook as Facebook,
    FaTwitter as Twitter,
    FaInstagram as Instagram,
    FaLinkedin as Linkedin,
} from 'react-icons/fa';



export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        orderNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                    orderNumber: ''
                });
                setTimeout(() => {
                    setSubmitted(false);
                }, 5000);
            } else {
                setError(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error(error)
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: Phone,
            title: 'Phone',
            details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
            hours: 'Mon-Fri, 9am-6pm EST',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: Mail,
            title: 'Email',
            details: ['support@shophub.com', 'sales@shophub.com'],
            hours: '24/7 support available',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: MapPin,
            title: 'Office',
            details: ['123 Commerce Street', 'New York, NY 10001', 'United States'],
            hours: 'Visit us by appointment',
            color: 'from-red-500 to-red-600'
        },
        {
            icon: Clock,
            title: 'Business Hours',
            details: ['Monday - Friday: 9am - 6pm', 'Saturday: 10am - 4pm', 'Sunday: Closed'],
            hours: 'Customer support 24/7',
            color: 'from-purple-500 to-purple-600'
        }
    ];

    const faqs = [
        {
            question: 'How long does shipping take?',
            answer: 'Standard shipping takes 5-7 business days, express shipping takes 2-3 business days.'
        },
        {
            question: 'What is your return policy?',
            answer: 'We offer 30-day returns for all unused products in original packaging.'
        },
        {
            question: 'Do you offer international shipping?',
            answer: 'Yes, we ship to over 50 countries worldwide.'
        },
        {
            question: 'How can I track my order?',
            answer: 'You can track your order from your account dashboard using the tracking number provided.'
        }
    ];

    if (submitted) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Message Sent!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {`Thanks for reaching out. We'll get back to you within 24 hours.`}
                        </p>
                        <Button variant="primary" onClick={() => setSubmitted(false)}>
                            Send Another Message
                        </Button>
                    </motion.div>
                </div>
            </>
        );
    }

    return (
        <>

            <div className="bg-white dark:bg-gray-900">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Contact Us
                            </h1>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto">
                                {`We'd love to hear from you. Get in touch with our team for any questions or support.`}
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-16">
                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactInfo.map((info, idx) => {
                            const Icon = info.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all"
                                >
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${info.color} mb-4`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {info.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {info.details.map((detail, i) => (
                                            <p key={i} className="text-gray-600 dark:text-gray-400 text-sm">
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">{info.hours}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Send us a Message
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {`Fill out the form below and we'll get back to you as soon as possible`}
                            </p>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Your Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Order Number (Optional)
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.orderNumber}
                                            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="#ORD-123456"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                        placeholder="Tell us how we can help..."
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    isLoading={loading}
                                    leftIcon={!loading ? <Send className="w-4 h-4" /> : undefined}
                                >
                                    Send Message
                                </Button>
                            </form>
                        </motion.div>

                        {/* FAQ Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-4">
                                    {faqs.map((faq, idx) => (
                                        <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                {faq.question}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Live Chat Card */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
                                <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Live Chat Support</h3>
                                <p className="text-white/90 mb-4">
                                    Need immediate assistance? Chat with our support team
                                </p>
                                <Button
                                    variant="primary"
                                    className="bg-white text-blue-600 hover:bg-gray-100"
                                    leftIcon={<MessageCircle className="w-4 h-4" />}
                                >
                                    Start Live Chat
                                </Button>
                                <p className="text-xs text-white/70 mt-4">
                                    Available 24/7 for all customers
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                                    Connect With Us
                                </h3>
                                <div className="flex justify-center gap-4">
                                    {[
                                        { icon: Facebook, href: '#', color: 'hover:bg-[#1877f2]' },
                                        { icon: Twitter, href: '#', color: 'hover:bg-[#1da1f2]' },
                                        { icon: Instagram, href: '#', color: 'hover:bg-gradient-to-r from-[#833ab4] to-[#fd1d1d]' },
                                        { icon: Linkedin, href: '#', color: 'hover:bg-[#0077b5]' }
                                    ].map((social, idx) => {
                                        const Icon = social.icon;
                                        return (
                                            <a
                                                key={idx}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center transition-all ${social.color} hover:text-white`}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

        </>
    );
}