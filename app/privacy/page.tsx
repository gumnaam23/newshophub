'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Eye,
  Database,
  Mail,
  Cookie,
  Users,
  MapPin,
  Phone
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: Database,
      content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include:
        • Name, email address, phone number, and shipping address
        • Payment information (processed securely by our payment partners)
        • Account preferences and order history
        • Communications with our support team`
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      content: `We use the information we collect to:
        • Process and fulfill your orders
        • Communicate with you about your orders and account
        • Improve our products and services
        • Send you promotional offers (with your consent)
        • Prevent fraud and enhance security`
    },
    {
      title: 'Information Sharing',
      icon: Users,
      content: `We do not sell your personal information. We may share your information with:
        • Service providers who assist with order fulfillment and payment processing
        • Law enforcement when required by law
        • With your consent for specific purposes`
    },
    {
      title: 'Cookies and Tracking',
      icon: Cookie,
      content: `We use cookies and similar technologies to:
        • Remember your preferences and shopping cart
        • Analyze website traffic and usage
        • Provide personalized recommendations
        • You can disable cookies in your browser settings`
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: `We implement industry-standard security measures to protect your information:
        • SSL encryption for all transactions
        • Regular security monitoring and updates
        • Limited access to personal information
        • Secure data storage practices`
    },
    {
      title: 'Your Rights',
      icon: Shield,
      content: `You have the right to:
        • Access and update your personal information
        • Request deletion of your account
        • Opt-out of marketing communications
        • Export your data`
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
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                How we collect, use, and protect your personal information
              </p>
              <p className="text-sm text-white/70 mt-4">Last Updated: January 1, 2024</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              At ShopHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website or make a purchase. Please read this privacy 
              policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </div>

          {/* Information Sections */}
          <div className="space-y-8">
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

          {/* Children's Privacy */}
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {`Children's Privacy`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Our website is not intended for children under 13. We do not knowingly collect personal information from children under 13. 
              If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </div>

          {/* Contact Information */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Questions About Privacy?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>privacy@shophub.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>123 Commerce Street, New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}

// Missing icons
