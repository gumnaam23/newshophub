'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

export function NewsletterSection() {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterName, setNewsletterName] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });
    const [newsletterLoading, setNewsletterLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newsletterEmail) {
            setNewsletterStatus({
                type: 'error',
                message: 'Please enter your email address'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newsletterEmail)) {
            setNewsletterStatus({
                type: 'error',
                message: 'Please enter a valid email address'
            });
            return;
        }

        setNewsletterLoading(true);
        setNewsletterStatus({ type: null, message: '' });

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newsletterEmail,
                    name: newsletterName,
                    preferences: {
                        promotions: true,
                        newArrivals: true,
                        deals: true,
                        weeklyDigest: false
                    },
                    source: 'homepage_newsletter'
                })
            });

            const data = await response.json();

            if (data.success) {
                setNewsletterStatus({
                    type: 'success',
                    message: data.message || 'Successfully subscribed to newsletter!'
                });
                setNewsletterEmail('');
                setNewsletterName('');
            } else {
                setNewsletterStatus({
                    type: 'error',
                    message: data.error || 'Failed to subscribe. Please try again.'
                });
            }
        } catch (error) {
            console.error(error)
            setNewsletterStatus({
                type: 'error',
                message: 'Network error. Please try again.'
            });
        } finally {
            setNewsletterLoading(false);

            setTimeout(() => {
                setNewsletterStatus({ type: null, message: '' });
            }, 5000);
        }
    };

    return (
        <div className="py-16 bg-linear-to-r from-blue-600 to-purple-600">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Subscribe to Our Newsletter
                    </h2>
                    <p className="text-white/90 mb-8">
                        Get the latest updates on new products and upcoming sales
                    </p>

                    {newsletterStatus.type && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${newsletterStatus.type === 'success'
                                    ? 'bg-green-500/20 text-green-100'
                                    : 'bg-red-500/20 text-red-100'
                                }`}
                        >
                            {newsletterStatus.type === 'success' ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                            <span>{newsletterStatus.message}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={newsletterName}
                            onChange={(e) => setNewsletterName(e.target.value)}
                            placeholder="Your name (optional)"
                            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                        <input
                            type="email"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={newsletterLoading}
                            disabled={newsletterLoading}
                            className="bg-white text-blue-600 hover:bg-gray-100"
                        >
                            {!newsletterLoading && <Send className="w-4 h-4 mr-2" />}
                            Subscribe
                        </Button>
                    </form>

                    <p className="text-white/70 text-xs mt-4">
                        By subscribing, you agree to our Privacy Policy and consent to receive updates.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}