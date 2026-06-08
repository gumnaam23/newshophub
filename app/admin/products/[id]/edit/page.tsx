'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  comparePrice: number;
  images: string[];
  category: string;
  stock: number;
  brand: string;
  colors: string[];
  sizes: string[];
  tags: string[];
  features: string[];
  isFeatured: boolean;
  isNewProduct: boolean;
}

interface Category {
  _id: string;
  name: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  
  const [formData, setFormData] = useState<Product>({
    _id: '',
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    comparePrice: 0,
    images: [],
    category: '',
    stock: 0,
    brand: '',
    colors: [],
    sizes: [],
    tags: [],
    features: [],
    isFeatured: false,
    isNewProduct: false
  });

  const [newColor, setNewColor] = useState<string>('');
  const [newSize, setNewSize] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [newFeature, setNewFeature] = useState<string>('');

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [productId]);

  const fetchProduct = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      const data = await response.json();
      if (data.success) {
        setFormData(data.data);
        setImageUrls(data.data.images || []);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (data.success) {
        const categoryNames: string[] = data.data
          .map((c: Category) => c.name)
          .filter((name: string, index: number, arr: string[]) => arr.indexOf(name) === index);
        setCategories(categoryNames);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addImage = (): void => {
    if (currentImageUrl && !imageUrls.includes(currentImageUrl)) {
      setImageUrls([...imageUrls, currentImageUrl]);
      setCurrentImageUrl('');
    }
  };

  const removeImage = (index: number): void => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const addItem = (
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>> | ((value: string[]) => void), 
    value: string, 
    setValue: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    if (value && !list.includes(value)) {
      setList([...list, value]);
      setValue('');
    }
  };

  const removeItem = (
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>> | ((value: string[]) => void), 
    item: string
  ): void => {
    setList(list.filter(i => i !== item));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    if (imageUrls.length === 0) {
      setError('Please add at least one product image');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: imageUrls
        })
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/products');
      } else {
        setError(data.error || 'Failed to update product');
      }
    } catch (error) {
      setError('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Update product information</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                required
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Price * ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Compare Price (Original Price)</label>
              <input
                type="number"
                step="0.01"
                value={formData.comparePrice}
                onChange={(e) => setFormData({ ...formData, comparePrice: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Images</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={currentImageUrl}
              onChange={(e) => setCurrentImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Image
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <img src={url} alt={`Product ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Short Description *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Long Description</label>
              <textarea
                rows={6}
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Colors & Sizes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colors */}
            <div>
              <label className="block text-sm font-medium mb-2">Colors</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Enter color"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
                <button
                  type="button"
                  onClick={() => addItem(formData.colors, (v: string[]) => setFormData({ ...formData, colors: v }), newColor, setNewColor)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map(color => (
                  <span key={color} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.toLowerCase() }} />
                    {color}
                    <button type="button" onClick={() => removeItem(formData.colors, (v: string[]) => setFormData({ ...formData, colors: v }), color)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium mb-2">Sizes</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Enter size"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
                <button
                  type="button"
                  onClick={() => addItem(formData.sizes, (v: string[]) => setFormData({ ...formData, sizes: v }), newSize, setNewSize)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map(size => (
                  <span key={size} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                    {size}
                    <button type="button" onClick={() => removeItem(formData.sizes, (v: string[]) => setFormData({ ...formData, sizes: v }), size)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features & Tags */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Info</h2>
          <div className="space-y-6">
            {/* Features */}
            <div>
              <label className="block text-sm font-medium mb-2">Key Features</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Enter feature"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
                <button
                  type="button"
                  onClick={() => addItem(formData.features, (v: string[]) => setFormData({ ...formData, features: v }), newFeature, setNewFeature)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map(feature => (
                  <span key={feature} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                    {feature}
                    <button type="button" onClick={() => removeItem(formData.features, (v: string[]) => setFormData({ ...formData, features: v }), feature)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
                <button
                  type="button"
                  onClick={() => addItem(formData.tags, (v: string[]) => setFormData({ ...formData, tags: v }), newTag, setNewTag)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                    {tag}
                    <button type="button" onClick={() => removeItem(formData.tags, (v: string[]) => setFormData({ ...formData, tags: v }), tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded"
              />
              <span>Featured Product</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isNewProduct}
                onChange={(e) => setFormData({ ...formData, isNewProduct: e.target.checked })}
                className="rounded"
              />
              <span>New Arrival</span>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <Link href="/admin/products">
            <button type="button" className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}