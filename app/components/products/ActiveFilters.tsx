'use client';

import { X } from 'lucide-react';

interface Filter {
  label: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  filters: Filter[];
  onClearAll: () => void;
}

export default function ActiveFilters({ filters, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter, idx) => (
        <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
          {filter.label}
          <button onClick={filter.onRemove} className="hover:text-blue-900">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button onClick={onClearAll} className="text-sm text-gray-500 hover:text-gray-700 underline">
        Clear all
      </button>
    </div>
  );
}