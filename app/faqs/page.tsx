'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Search,
  ShoppingBag,
  Truck,
  RefreshCw,
  Shield,
  CreditCard,
  Package,
  Mail,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'All Questions', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingBag },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'returns', name: 'Returns', icon: RefreshCw },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'account', name: 'Account', icon: Shield },
  ];

  const faqs: FAQ[] = [
    // Orders
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'To place an order, simply browse our products, add items to your cart, proceed to checkout, enter your shipping information, choose a payment method, and confirm your order. You will receive an order confirmation email once your order is placed.',
      category: 'orders'
    },
    {
      id: 2,
      question: 'Can I cancel or modify my order?',
      answer: 'You can cancel or modify your order within 1 hour of placing it. Please contact our customer support immediately if you need to make changes. Once the order is processed for shipping, modifications may not be possible.',
      category: 'orders'
    },
    {
      id: 3,
      question: 'How do I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via email. You can also track your order by logging into your account and visiting the "My Orders" section, or by using our Track Order page.',
      category: 'orders'
    },
    {
      id: 4,
      question: 'What if I receive a damaged item?',
      answer: 'If you receive a damaged or defective item, please contact our customer support within 48 hours of delivery. We will arrange for a replacement or refund as quickly as possible. Please provide photos of the damaged item for faster processing.',
      category: 'orders'
    },

    // Shipping
    {
      id: 5,
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days, express shipping takes 2-3 business days, and overnight shipping takes 1 business day. Delivery times may vary based on your location and weather conditions.',
      category: 'shipping'
    },
    {
      id: 6,
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days. Please note that customs fees and import duties may apply and are the responsibility of the customer.',
      category: 'shipping'
    },
    {
      id: 7,
      question: 'How much does shipping cost?',
      answer: 'Shipping costs are calculated based on your location and order weight. We offer free standard shipping on all orders over $50 within the United States. International shipping rates vary by destination.',
      category: 'shipping'
    },
    {
      id: 8,
      question: 'Can I change my shipping address after ordering?',
      answer: 'If you need to change your shipping address, please contact us immediately. Changes can only be made before the order is shipped. Once shipped, the address cannot be modified.',
      category: 'shipping'
    },

    // Returns
    {
      id: 9,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be unused, in original packaging, and in the same condition as received. Some items like personalized products, perishable goods, and intimate apparel are non-returnable.',
      category: 'returns'
    },
    {
      id: 10,
      question: 'How do I return an item?',
      answer: 'To return an item, log into your account, go to "My Orders", select the order containing the item, and click "Return Item". Follow the instructions to generate a return label. Pack the item securely and ship it back to us.',
      category: 'returns'
    },
    {
      id: 11,
      question: 'How long does it take to process a refund?',
      answer: 'Once we receive your return, please allow 5-7 business days for inspection and processing. Refunds are typically issued within 3-5 business days after approval, depending on your payment method and bank.',
      category: 'returns'
    },
    {
      id: 12,
      question: 'Who pays for return shipping?',
      answer: 'If the return is due to our error (damaged, wrong item, defective), we will cover the return shipping costs. For other reasons (changed mind, wrong size), the customer is responsible for return shipping fees.',
      category: 'returns'
    },

    // Payments
    {
      id: 13,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through encrypted connections.',
      category: 'payments'
    },
    {
      id: 14,
      question: 'Is it safe to use my credit card on your site?',
      answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We are PCI compliant and never store your full credit card details on our servers. Your security is our top priority.',
      category: 'payments'
    },
    {
      id: 15,
      question: 'When will my card be charged?',
      answer: 'Your card will be charged at the time of order confirmation. You will see a pending charge immediately, which will be finalized once your order is processed and shipped.',
      category: 'payments'
    },

    // Account
    {
      id: 16,
      question: 'How do I create an account?',
      answer: 'Click on the "Login" button at the top of the page and select "Create Account". Fill in your name, email address, and create a password. You can also sign up using your Google or Facebook account.',
      category: 'account'
    },
    {
      id: 17,
      question: 'I forgot my password. What should I do?',
      answer: 'Click on "Forgot Password" on the login page, enter your email address, and we will send you a password reset link. Follow the instructions in the email to create a new password.',
      category: 'account'
    },
    {
      id: 18,
      question: 'How do I update my account information?',
      answer: 'Log into your account and go to "Account Settings". From there, you can update your personal information, email address, password, and saved addresses.',
      category: 'account'
    },
    {
      id: 19,
      question: 'How do I delete my account?',
      answer: 'To delete your account, please contact our customer support. They will guide you through the process. Note that account deletion is permanent and cannot be undone.',
      category: 'account'
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Find answers to common questions about our products, orders, and services
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* FAQs Accordion */}
          <div className="max-w-3xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No questions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or browse other categories
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          openFAQ === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-4"
                        >
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {`Can't find what you're looking for? Our support team is here to help.`}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="primary" size="lg" leftIcon={<Mail className="w-4 h-4" />}>
                  Contact Us
                </Button>
              </Link>
              <a href="tel:+15551234567">
                <Button variant="outline" size="lg" leftIcon={<Phone className="w-4 h-4" />}>
                  Call Support
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}