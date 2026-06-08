'use client';


export default function AdminLoading() {
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28" />
        </div>
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      </div>
    </div>
  );

  const SkeletonTableRow = () => (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
      </div>
      <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </div>
  );

  return (
    <div>
      {/* Header Skeleton */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96" />
        </div>
        <div className="flex gap-3">
          <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Time Range Skeleton */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
              <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-80 bg-gray-100 dark:bg-gray-700/30 rounded-lg animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3, 4].map((j) => (
                <SkeletonTableRow key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}