'use client';
import { motion } from 'framer-motion';

export function PromoBanner() {
  return (
    <div className="relative overflow-hidden bg-linear-to-r from-red-600 to-orange-600 py-12">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Flash Sale! Up to 70% Off
          </h3>
          <p className="text-white/90 mb-6">
            {`Limited time offer. Grab your favorites before they're gone!`}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            onClick={() => window.location.href = '/products?deals=true'}
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  );
}