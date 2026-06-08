'use client';

import { motion } from 'framer-motion';
import { CheckCircle, LucideIcon } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  enabled: boolean;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function PaymentMethodCard({
  method,
  index,
  isSelected,
  onSelect,
}: PaymentMethodCardProps) {
  const Icon = method.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : method.enabled
          ? 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
          : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
      }`}
      onClick={() => method.enabled && onSelect(method.id)}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-lg ${
            isSelected
              ? 'bg-blue-100 dark:bg-blue-900/40'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              isSelected ? 'text-blue-600' : 'text-gray-600'
            }`}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {method.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {method.description}
          </p>
        </div>
        {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
        {!method.enabled && (
          <span className="text-xs text-gray-500">Coming Soon</span>
        )}
      </div>
    </motion.div>
  );
}