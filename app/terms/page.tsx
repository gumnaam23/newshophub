'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  Scale,
  ShoppingBag,
  CreditCard,
  Truck,
  RefreshCw,
  AlertCircle,
  Shield,
  CheckCircle,
  Mail,
  Phone
} from 'lucide-react';

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: `By accessing or using ShopHub's website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.`
    },
    {
      title: 'Products and Pricing',
      icon: ShoppingBag,
      content: `• All product descriptions and prices are subject to change without notice
        • We reserve the right to modify or discontinue any product at any time
        • Prices may vary based on location and market conditions
        • We are not responsible for typographical errors in pricing or descriptions`
    },
    {
      title: 'Orders and Payment',
      icon: CreditCard,
      content: `• We reserve the right to refuse or cancel any order for any reason
        • Payment must be received in full before order processing
        • In case of pricing errors, we may cancel the order and notify you
        • Promotional offers are subject to specific terms and conditions`
    },
    {
      title: 'Shipping and Delivery',
      icon: Truck,
      content: `• Delivery times are estimates and not guaranteed
        • Risk of loss transfers to you upon delivery
        • International orders may be subject to customs fees
        • We are not responsible for delays caused by carriers or customs`
    },
    {
      title: 'Returns and Refunds',
      icon: RefreshCw,
      content: `• Returns are accepted within 30 days of delivery
        • Items must be unused and in original packaging
        • Return shipping costs are customer's responsibility unless item is defective
        • Refunds are processed within 5-7 business days of receiving return`
    },
    {
      title: 'Account Responsibility',
      icon: Shield,
      content: `• You are responsible for maintaining account security
        • You agree to provide accurate account information
        • You are liable for all activities under your account
        • Notify us immediately of unauthorized account access`
    },
    {
      title: 'Limitation of Liability',
      icon: AlertCircle,
      content: `• ShopHub is not liable for indirect or consequential damages
        • Our total liability is limited to the amount paid for products
        • We do not warrant that the service will be uninterrupted or error-free
        • Some jurisdictions do not allow certain liability limitations`
    }
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
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Please read these terms carefully before using our website
              </p>
              <p className="text-sm text-white/70 mt-4">Effective Date: January 1, 2024</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Welcome to ShopHub. These Terms of Service govern your use of our website and services. 
              By accessing or using our website, you agree to be bound by these terms. If you do not agree 
              to all the terms and conditions, you may not access the website or use any services.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Governing Law */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              Governing Law
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              These Terms shall be governed by and construed in accordance with the laws of the United States, 
              without regard to its conflict of law provisions. Any dispute arising from these terms shall be 
              resolved in the courts of New York.
            </p>
          </div>

          {/* Contact */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Questions About Terms?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have any questions about these Terms of Service, please contact us.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>legal@shophub.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}