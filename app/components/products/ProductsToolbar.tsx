'use client';

import { Grid, List, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface ProductsToolbarProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onFilterClick: () => void;
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' },
];

export default function ProductsToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onFilterClick,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="md" onClick={onFilterClick} className="lg:hidden" leftIcon={<Filter className="w-4 h-4" />}>
          Filters
        </Button>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}