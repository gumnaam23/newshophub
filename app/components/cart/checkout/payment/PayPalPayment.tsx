'use client';

import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

interface PayPalPaymentProps {
  selectedMethod: string;
}

export default function PayPalPayment({ selectedMethod }: PayPalPaymentProps) {
  if (selectedMethod !== 'paypal') return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center"
    >
      <Wallet className="w-12 h-12 text-blue-600 mx-auto mb-3" />
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        You will be redirected to PayPal to complete your payment
      </p>
    </motion.div>
  );
}