'use client';
import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
    { icon: Shield, title: "Secure Payment", description: "100% secure transactions" },
    { icon: RefreshCw, title: "30 Day Returns", description: "Easy returns policy" },
    { icon: Headphones, title: "24/7 Support", description: "Dedicated customer support" }
  ];

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}