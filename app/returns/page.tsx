'use client';

import { motion } from 'framer-motion';
import {
  RefreshCw,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  AlertCircle,
  Truck,
  Mail,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/app/components/ui/Button';

export default function ReturnsPolicyPage() {
  const steps = [
    {
      step: 1,
      title: 'Request Return',
      description: 'Log into your account and submit a return request within 30 days of delivery.',
      icon: RefreshCw
    },
    {
      step: 2,
      title: 'Get Approval',
      description: 'Our team will review your request and provide return instructions within 24 hours.',
      icon: CheckCircle
    },
    {
      step: 3,
      title: 'Pack & Ship',
      description: 'Pack the item securely and ship it back using the provided return label.',
      icon: Package
    },
    {
      step: 4,
      title: 'Receive Refund',
      description: 'Once received, we\'ll inspect the item and process your refund within 5-7 business days.',
      icon: DollarSign
    }
  ];

  const nonReturnableItems = [
    'Personalized or custom-made products',
    'Perishable goods (food, flowers, etc.)',
    'Intimate apparel (underwear, swimwear)',
    'Gift cards',
    'Downloadable software or digital products',
    'Health and personal care items',
    'Final sale or clearance items'
  ];

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
              <RefreshCw className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Returns Policy
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Our commitment to your satisfaction with easy and hassle-free returns
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Return Policy Summary */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              30-Day Return Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
              Not completely satisfied with your purchase? You can return most items within 30 days of delivery for a full refund.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span>30 days to return</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Full refund on eligible items</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                <span>Free returns on defective items</span>
              </div>
            </div>
          </div>

          {/* Return Steps */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
              How to Return an Item
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Follow these simple steps to return your item
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mt-4 mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Conditions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Return Conditions
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Item must be unused and in original condition</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Original packaging and tags must be intact</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Return request must be submitted within 30 days of delivery</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Proof of purchase is required</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Non-Returnable Items
              </h3>
              <ul className="space-y-3">
                {nonReturnableItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-16">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Refund Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Processing Time</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Refunds are processed within 5-7 business days after we receive and inspect your return.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Refund Method</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Refunds are issued to your original payment method. Processing time may vary by bank.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Return Shipping Costs</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  For defective or incorrect items, we cover return shipping. For other returns, customer is responsible.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Partial Refunds</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Items returned damaged, used, or missing parts may receive a partial refund.
                </p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Need Help with Your Return?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our customer support team is here to assist you with any return-related questions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="primary" leftIcon={<Mail className="w-4 h-4" />}>
                  Contact Support
                </Button>
              </Link>
              <Link href="/account/orders">
                <Button variant="outline" leftIcon={<Package className="w-4 h-4" />}>
                  View My Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}

// Missing icon
