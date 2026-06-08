'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Image as ImageIcon,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
}

interface FormData {
  name: string;
  description: string;
  longDescription: string;
  price: string;
  comparePrice: string;
  category: string;
  stock: string;
  brand: string;
  colors: string[];
  sizes: string[];
  tags: string[];
  isFeatured: boolean;
  isNewProduct: boolean;
  features: string[];
}

export default function AddProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    longDescription: '',
    price: '',
    comparePrice: '',
    category: '',
    stock: '',
    brand: '',
    colors: [],
    sizes: [],
    tags: [],
    isFeatured: false,
    isNewProduct: true,
    features: []
  });

  const [newColor, setNewColor] = useState<string>('');
  const [newSize, setNewSize] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [newFeature, setNewFeature] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

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

  // Fix the addItem function signature
//   const addItem = (field: keyof FormData) => (value: string) => {
//     if (value && !(formData[field] as string[]).includes(value)) {
//       setFormData({
//         ...formData,
//         [field]: [...(formData[field] as string[]), value]
//       });
//       // Clear the respective input field
//       if (field === 'colors') setNewColor('');
//       if (field === 'sizes') setNewSize('');
//       if (field === 'tags') setNewTag('');
//       if (field === 'features') setNewFeature('');
//     }
//   };


//  // Replace the existing removeItem function with this
// const removeItem = (field: keyof FormData, item: string) => {
//   setFormData({
//     ...formData,
//     [field]: (formData[field] as string[]).filter(i => i !== item)
//   });
// };
  // Add these handler functions before return
  const handleAddColor = (color: string) => {
    if (color && !formData.colors.includes(color)) {
      setFormData({ ...formData, colors: [...formData.colors, color] });
      setNewColor('');
    }
  };

  const handleRemoveColor = (color: string) => {
    setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) });
  };

  const handleAddSize = (size: string) => {
    if (size && !formData.sizes.includes(size)) {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
      setNewSize('');
    }
  };

  const handleRemoveSize = (size: string) => {
    setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleAddFeature = (feature: string) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData({ ...formData, features: [...formData.features, feature] });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData({ ...formData, features: formData.features.filter(f => f !== feature) });
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
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          longDescription: formData.longDescription,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : 0,
          category: formData.category,
          stock: parseInt(formData.stock),
          brand: formData.brand,
          images: imageUrls,
          colors: formData.colors,
          sizes: formData.sizes,
          tags: formData.tags,
          features: formData.features,
          isFeatured: formData.isFeatured,
          isNewProduct: formData.isNewProduct
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/products');
      } else {
        setError(data.error || 'Failed to create product');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to create product');
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create a new product for your store</p>
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
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
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
            {imageUrls.length === 0 && (
              <div className="col-span-full text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Add at least one product image</p>
              </div>
            )}
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
      onClick={() => handleAddColor(newColor)}
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
        <button type="button" onClick={() => handleRemoveColor(color)}>
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
              onClick={() => handleAddSize(newSize)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.sizes.map(size => (
              <span key={size} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                {size}
                <button type="button" onClick={() => handleRemoveSize(size)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

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
              onClick={() => handleAddFeature(newFeature)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features.map(feature => (
              <span key={feature} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                {feature}
                <button type="button" onClick={() => handleRemoveFeature(feature)}>
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
              onClick={() => handleAddTag(newTag)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Featured & New */}
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
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}