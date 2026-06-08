'use client';

import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

// Simplified LoaderContent that uses size directly
const LoaderContent = ({ size, text }: { size: 'sm' | 'md' | 'lg'; text: string }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const spinnerSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated Shopping Bag Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        >
          <div className="w-full h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl" />
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative flex items-center justify-center w-full h-full"
        >
          <ShoppingBag className={`${spinnerSizeClasses[size]} text-blue-600 dark:text-blue-400`} />
        </motion.div>
        
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
        >
          <div className={`${spinnerSizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full`} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-gray-600 dark:text-gray-400 font-medium">{text}</p>
        <div className="flex gap-1 justify-center mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-blue-600 rounded-full"
            />
          ))}
        </div>
      </motion.div>

      <div className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"
        />
      </div>
    </div>
  );
};

const Loader = ({ size = 'md', fullScreen = true, text = 'Loading...' }: LoaderProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
        <LoaderContent size={size} text={text} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 min-h-[200px]">
      <LoaderContent size={size} text={text} />
    </div>
  );
};

export default Loader;