'use client';

import { motion } from 'framer-motion';

export default function ProductsLoading() {
  const SkeletonCard = ({ index }: { index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
    >
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-full" />
      </div>
    </motion.div>
  );

  const SkeletonList = ({ index }: { index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="md:w-64">
          <div className="aspect-square md:h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
          <div className="flex gap-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
          </div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mt-1" />
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-32" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header Banner Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
          <div className="container mx-auto px-4">
            <div className="h-12 bg-white/20 rounded-lg animate-pulse w-64 mb-2" />
            <div className="h-6 bg-white/20 rounded-lg animate-pulse w-48" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Toolbar Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex gap-3">
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
          </div>
          
          <div className="flex gap-8">
            {/* Filters Sidebar Skeleton */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 space-y-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Products Grid Skeleton */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, idx) => (
                  <SkeletonCard key={idx} index={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}