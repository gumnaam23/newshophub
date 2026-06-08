'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Calendar, Lock, Eye, EyeOff } from 'lucide-react';

interface CardDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface CardPaymentFormProps {
  selectedMethod: string;
  cardDetails: CardDetails;
  saveCard: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onInputChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
  onSaveCardChange: (checked: boolean) => void;
}

export default function CardPaymentForm({
  selectedMethod,
  cardDetails,
  saveCard,
  errors,
  touched,
  onInputChange,
  onBlur,
  onSaveCardChange,
}: CardPaymentFormProps) {
  const [showCVV, setShowCVV] = useState(false);

  if (selectedMethod !== 'card') return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Number
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={cardDetails.cardNumber}
            onChange={(e) => onInputChange('cardNumber', e.target.value)}
            onBlur={() => onBlur('cardNumber')}
            placeholder="1234 5678 9012 3456"
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 ${
              errors.cardNumber && touched.cardNumber
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            maxLength={19}
          />
        </div>
        {errors.cardNumber && touched.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={cardDetails.cardName}
          onChange={(e) => onInputChange('cardName', e.target.value)}
          onBlur={() => onBlur('cardName')}
          placeholder="John Doe"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 ${
            errors.cardName && touched.cardName
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.cardName && touched.cardName && (
          <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Expiry Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={cardDetails.expiryDate}
              onChange={(e) => onInputChange('expiryDate', e.target.value)}
              onBlur={() => onBlur('expiryDate')}
              placeholder="MM/YY"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 ${
                errors.expiryDate && touched.expiryDate
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              maxLength={5}
            />
          </div>
          {errors.expiryDate && touched.expiryDate && (
            <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CVV
          </label>
          <div className="relative">
            <input
              type={showCVV ? 'text' : 'password'}
              value={cardDetails.cvv}
              onChange={(e) => onInputChange('cvv', e.target.value)}
              onBlur={() => onBlur('cvv')}
              placeholder="123"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 ${
                errors.cvv && touched.cvv
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              maxLength={4}
            />
            <button
              type="button"
              onClick={() => setShowCVV(!showCVV)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showCVV ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.cvv && touched.cvv && (
            <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="saveCard"
          checked={saveCard}
          onChange={(e) => onSaveCardChange(e.target.checked)}
          className="rounded"
        />
        <label
          htmlFor="saveCard"
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          Save this card for future purchases
        </label>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600" />
          <p className="text-xs text-blue-800 dark:text-blue-400">
            Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </motion.div>
  );
}