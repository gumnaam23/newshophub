'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface NotificationToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export function NotificationToast({ show, message, type }: NotificationToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3"
          style={{
            background: type === 'success' 
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #ef4444, #dc2626)'
          }}
        >
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : (
            <XCircle className="w-5 h-5 text-white" />
          )}
          <span className="text-white font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}