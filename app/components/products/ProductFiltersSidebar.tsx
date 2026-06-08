'use client';

import { SlidersHorizontal, Star, X } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  ratings: number[];
  brands: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
}


interface ProductFiltersSidebarProps {
  categories: { _id: string; name: string; count: number }[];
  brands: { name: string; count: number }[];
  priceRange: [number, number];
  selectedFilters: FilterState;
  onFilterChange: (filterType: keyof FilterState, value: string | number | boolean | [number, number]) => void;
  onClearAll: () => void;
}

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const availableColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink'];

export default function ProductFiltersSidebar({
  categories,
  brands,
  priceRange,
  selectedFilters,
  onFilterChange,
  onClearAll,
}: ProductFiltersSidebarProps) {
  const hasActiveFilters =
    selectedFilters.categories.length > 0 ||
    selectedFilters.brands.length > 0 ||
    selectedFilters.ratings.length > 0 ||
    selectedFilters.sizes.length > 0 ||
    selectedFilters.colors.length > 0 ||
    selectedFilters.inStock ||
    selectedFilters.onSale ||
    selectedFilters.isNew;

  return (
    <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
        <SlidersHorizontal className="w-5 h-5 text-gray-500" />
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((category, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFilters.categories.includes(category.name)}
                  onChange={() => onFilterChange('categories', category.name)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </span>
                <span className="text-xs text-gray-500">({category.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Price Range</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>${selectedFilters.priceRange[0]}</span>
              <span>${selectedFilters.priceRange[1]}</span>
            </div>
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={selectedFilters.priceRange[1]}
              onChange={(e) => onFilterChange('priceRange', [selectedFilters.priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={selectedFilters.priceRange[0]}
                onChange={(e) => onFilterChange('priceRange', [parseInt(e.target.value) || 0, selectedFilters.priceRange[1]])}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Min"
              />
              <input
                type="number"
                value={selectedFilters.priceRange[1]}
                onChange={(e) => onFilterChange('priceRange', [selectedFilters.priceRange[0], parseInt(e.target.value) || 0])}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Brands */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Brands</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand.name} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFilters.brands.includes(brand.name)}
                  onChange={() => onFilterChange('brands', brand.name)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </span>
                <span className="text-xs text-gray-500">({brand.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Customer Rating</h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFilters.ratings.includes(rating)}
                  onChange={() => onFilterChange('ratings', rating)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">& up</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => onFilterChange('sizes', size)}
                className={`px-3 py-1 text-sm rounded-md border transition-all ${
                  selectedFilters.sizes.includes(size)
                    ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'border-gray-300 text-gray-600 hover:border-blue-300 dark:border-gray-600 dark:text-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => onFilterChange('colors', color.toLowerCase())}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedFilters.colors.includes(color.toLowerCase())
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Special Filters */}
        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedFilters.inStock}
              onChange={() => onFilterChange('inStock', true)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors">
              In Stock Only
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedFilters.onSale}
              onChange={() => onFilterChange('onSale', true)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors">
              On Sale
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedFilters.isNew}
              onChange={() => onFilterChange('isNew', true)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors">
              New Arrivals
            </span>
          </label>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearAll} fullWidth>
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
}