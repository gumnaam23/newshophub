'use client';

import { motion } from 'framer-motion';
import {
  Truck,
  Clock,
  Globe,
  Package,
  MapPin,
  Shield,
  Calendar,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

export default function ShippingInfoPage() {
  const shippingMethods = [
    {
      name: 'Standard Shipping',
      duration: '5-7 business days',
      price: '$5.99',
      free: 'Free on orders $50+',
      icon: Truck,
      features: ['Tracking included', 'Delivery confirmation', 'Insurance up to $100']
    },
    {
      name: 'Express Shipping',
      duration: '2-3 business days',
      price: '$12.99',
      free: false,
      icon: Clock,
      features: ['Priority processing', 'Real-time tracking', 'Insurance up to $200']
    },
    {
      name: 'Overnight Shipping',
      duration: '1 business day',
      price: '$24.99',
      free: false,
      icon: Package,
      features: ['Same-day processing', 'Express tracking', 'Insurance up to $300']
    },
    {
      name: 'International Shipping',
      duration: '7-14 business days',
      price: 'Calculated at checkout',
      free: false,
      icon: Globe,
      features: ['Customs clearance', 'International tracking', 'Varies by destination']
    }
  ];

  const regions = [
    { region: 'United States', transit: '5-7 days', express: '2-3 days', cost: 'Free over $50' },
    { region: 'Canada', transit: '7-10 days', express: '3-5 days', cost: 'Starting at $15.99' },
    { region: 'United Kingdom', transit: '7-12 days', express: '3-6 days', cost: 'Starting at $19.99' },
    { region: 'Australia', transit: '10-14 days', express: '5-8 days', cost: 'Starting at $24.99' },
    { region: 'Europe', transit: '8-12 days', express: '4-7 days', cost: 'Starting at $19.99' },
    { region: 'Asia', transit: '10-14 days', express: '5-8 days', cost: 'Starting at $24.99' }
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
              <Truck className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Shipping Information
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Learn about our shipping options, delivery times, and policies
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Shipping Methods */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
              Shipping Methods
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Choose the shipping option that works best for you
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {shippingMethods.map((method, idx) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all"
                  >
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{method.duration}</p>
                    <p className="text-2xl font-bold text-blue-600 mb-2">{method.price}</p>
                    {method.free && (
                      <p className="text-sm text-green-600 mb-4">{method.free}</p>
                    )}
                    <div className="text-left mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {method.features.map((feature, i) => (
                        <p key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {feature}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Shipping Rates by Region */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
              Shipping Rates by Region
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Estimated delivery times and costs for different regions
            </p>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Region</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Standard Shipping</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Express Shipping</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {regions.map((region, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{region.region}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{region.transit}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{region.express}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{region.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Shipping Policies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <MapPin className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Order Processing</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Orders are processed within 1-2 business days. You will receive a confirmation email once your order ships.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <Calendar className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tracking Information</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {`All orders include tracking. You'll receive a tracking number via email once your order ships.`}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <Shield className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Shipping Insurance</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All orders are insured against loss or damage. Contact us immediately if you encounter any issues.
              </p>
            </motion.div>
          </div>

          {/* International Shipping Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 text-center">
            <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              International Shipping
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
              We ship to over 50 countries worldwide. International customers are responsible for any customs fees, import duties, or taxes that may apply.
            </p>
            <Link href="/contact">
              <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Contact for International Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
    </>
  );
}