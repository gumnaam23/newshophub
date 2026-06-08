'use client';

import { motion } from 'framer-motion';

interface BankTransferPaymentProps {
  selectedMethod: string;
}

export default function BankTransferPayment({ selectedMethod }: BankTransferPaymentProps) {
  if (selectedMethod !== 'bank_transfer') return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
    >
      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
        Bank Transfer Details
      </h4>
      <div className="space-y-2 text-sm">
        <p className="text-gray-600 dark:text-gray-400">Bank: Example Bank</p>
        <p className="text-gray-600 dark:text-gray-400">
          Account Name: ShopHub Store
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Account Number: 1234567890
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Routing Number: 987654321
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Please use your order number as reference when making the transfer
        </p>
      </div>
    </motion.div>
  );
}