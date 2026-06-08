'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';

import ProductsHeader from '@/app/components/products/ProductsHeader';
import ProductsToolbar from '@/app/components/products/ProductsToolbar';
import ProductList from '@/app/components/products/ProductList';
import ProductsPagination from '@/app/components/products/ProductsPagination';
import ActiveFilters from '@/app/components/products/ActiveFilters';
import { IProduct } from '@/models/Product';
import ProductFiltersModal from './ProductFiltersModal';
import ProductFiltersSidebar from './ProductFiltersSidebar';
import { CartNotification } from '../ui/CartNotification';

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


export default function ProductsClient() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Filter data
  const [categories, setCategories] = useState<{ _id: string; name: string; count: number }[]>([]);
  const [brands, setBrands] = useState<{ name: string; count: number }[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    categories: [], priceRange: [0, 1000], ratings: [], brands: [],
    sizes: [], colors: [], inStock: false, onSale: false, isNew: false
  });

  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const isNewParam = searchParams.get('isNew');
  const dealsParam = searchParams.get('deals');

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '12');
      params.append('sort', sortBy);
      if (categoryParam) params.append('category', categoryParam);
      if (searchQuery) params.append('search', searchQuery);
      if (isNewParam) params.append('isNew', 'true');
      if (dealsParam) params.append('deals', 'true');
      if (selectedFilters.categories.length) params.append('categories', selectedFilters.categories.join(','));
      if (selectedFilters.brands.length) params.append('brands', selectedFilters.brands.join(','));
      if (selectedFilters.priceRange[0] > 0 || selectedFilters.priceRange[1] < 1000) {
        params.append('minPrice', selectedFilters.priceRange[0].toString());
        params.append('maxPrice', selectedFilters.priceRange[1].toString());
      }
      if (selectedFilters.ratings.length) params.append('minRating', Math.min(...selectedFilters.ratings).toString());
      if (selectedFilters.sizes.length) params.append('sizes', selectedFilters.sizes.join(','));
      if (selectedFilters.colors.length) params.append('colors', selectedFilters.colors.join(','));
      if (selectedFilters.inStock) params.append('inStock', 'true');
      if (selectedFilters.onSale) params.append('onSale', 'true');
      if (selectedFilters.isNew) params.append('isNew', 'true');

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
        setTotalProducts(data.pagination.total);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, selectedFilters, categoryParam, searchQuery, isNewParam, dealsParam]);

  // Fetch filters data
  const fetchFilters = useCallback(async () => {
    try {
      const [categoriesRes, brandsRes, priceRes] = await Promise.all([
        fetch('/api/products/categories'),
        fetch('/api/products/brands'),
        fetch('/api/products/price-range')
      ]);
      const categoriesData = await categoriesRes.json();
      const brandsData = await brandsRes.json();
      const priceData = await priceRes.json();
      if (categoriesData.success) setCategories(categoriesData.data);
      if (brandsData.success) setBrands(brandsData.data);
      if (priceData.success) setPriceRange([priceData.data.min, priceData.data.max]);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchFilters();
  }, [fetchProducts, fetchFilters]);

  // Add to cart
  const handleAddToCart = async (productId: string) => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    setAddingToCartId(productId);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      const data = await response.json();
      if (data.success) {
        setNotification({ show: true, message: 'Product added to cart!', type: 'success' });
      } else {
        setNotification({ show: true, message: data.error || 'Failed to add to cart', type: 'error' });
      }
    } catch (error) {
      setNotification({ show: true, message: 'Failed to add to cart', type: 'error' });
    } finally {
      setAddingToCartId(null);
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handleFilterChange = (filterType: keyof FilterState, value: string | number | boolean | [number, number]) => {
    if (filterType === 'priceRange') {
      setSelectedFilters(prev => ({ ...prev, priceRange: value as [number, number] }));
      return;
    }
    if (['categories', 'brands', 'ratings', 'sizes', 'colors'].includes(filterType)) {
      setSelectedFilters(prev => {
        const current = prev[filterType] as string[];
        const newValue = current.includes(value as string) ? current.filter(v => v !== value) : [...current, value as string];
        return { ...prev, [filterType]: newValue };
      });
      return;
    }
    if (filterType === 'inStock' || filterType === 'onSale' || filterType === 'isNew') {
      setSelectedFilters(prev => ({ ...prev, [filterType]: !prev[filterType] }));
      return;
    }
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [], priceRange: [priceRange[0], priceRange[1]], ratings: [], brands: [],
      sizes: [], colors: [], inStock: false, onSale: false, isNew: false
    });
    setCurrentPage(1);
  };

  // Build active filters list
  const activeFiltersList = [];
  if (categoryParam) activeFiltersList.push({ label: `Category: ${categoryParam}`, onRemove: () => router.push('/products') });
  if (searchQuery) activeFiltersList.push({ label: `Search: ${searchQuery}`, onRemove: () => router.push('/products') });
  selectedFilters.categories.forEach(cat => activeFiltersList.push({ label: `Category: ${cat}`, onRemove: () => handleFilterChange('categories', cat) }));
  selectedFilters.brands.forEach(brand => activeFiltersList.push({ label: `Brand: ${brand}`, onRemove: () => handleFilterChange('brands', brand) }));
  if (selectedFilters.priceRange[0] > priceRange[0] || selectedFilters.priceRange[1] < priceRange[1]) {
    activeFiltersList.push({ label: `Price: $${selectedFilters.priceRange[0]} - $${selectedFilters.priceRange[1]}`, onRemove: () => setSelectedFilters(prev => ({ ...prev, priceRange: [priceRange[0], priceRange[1]] })) });
  }
  if (selectedFilters.ratings.length) activeFiltersList.push({ label: `Rating: ${Math.min(...selectedFilters.ratings)}+ stars`, onRemove: () => setSelectedFilters(prev => ({ ...prev, ratings: [] })) });
  if (selectedFilters.inStock) activeFiltersList.push({ label: 'In Stock', onRemove: () => handleFilterChange('inStock', true) });
  if (selectedFilters.onSale) activeFiltersList.push({ label: 'On Sale', onRemove: () => handleFilterChange('onSale', true) });
  if (selectedFilters.isNew) activeFiltersList.push({ label: 'New Arrivals', onRemove: () => handleFilterChange('isNew', true) });

  const pageTitle = categoryParam ? categoryParam : searchQuery ? `Search: ${searchQuery}` : 'All Products';

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <ProductsHeader title={pageTitle} totalProducts={totalProducts} />

        <div className="container mx-auto px-4 py-8">
          <ProductsToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onFilterClick={() => setShowFilters(true)}
          />

          <ActiveFilters filters={activeFiltersList} onClearAll={clearAllFilters} />

          <div className="flex gap-8">
            <div className="hidden lg:block w-64 flex-shrink-0">
              <ProductFiltersSidebar
                categories={categories}
                brands={brands}
                priceRange={priceRange}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
              />
            </div>

            <div className="flex-1">
              <ProductList
                products={products}
                loading={loading}
                viewMode={viewMode}
                onAddToCart={handleAddToCart}
                addingToCartId={addingToCartId}
                onClearFilters={clearAllFilters}
              />
              {totalPages > 1 && <ProductsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
            </div>
          </div>
        </div>
      </div>

      <ProductFiltersModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        categories={categories}
        brands={brands}
        priceRange={priceRange}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearAll={clearAllFilters}
        onApply={() => setShowFilters(false)}
      />

      <CartNotification show={notification.show} message={notification.message} type={notification.type} />
    </>
  );
}