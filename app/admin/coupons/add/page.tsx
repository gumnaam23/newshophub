'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function AddCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '',
    minPurchase: '',
    maxDiscount: '',
    usageLimit: '1',
    perUserLimit: '1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.value || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.type === 'percentage' && parseFloat(formData.value) > 100) {
      setError('Percentage discount cannot exceed 100%');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          code: formData.code.toUpperCase(),
          value: parseFloat(formData.value),
          minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : 0,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          usageLimit: parseInt(formData.usageLimit),
          perUserLimit: parseInt(formData.perUserLimit)
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Coupon created successfully! Redirecting...');
        setTimeout(() => router.push('/admin/coupons'), 1500);
      } else {
        setError(data.error || 'Failed to create coupon');
      }
    } catch (error) {
      console.error(error)
      setError('Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData({ ...formData, code: result });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/coupons">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Coupon</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create a new discount coupon</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Coupon Code *
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 uppercase"
                    placeholder="SUMMER2024"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Only letters and numbers, no spaces</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                placeholder="Summer Sale Discount"
                required
              />
            </div>
          </div>
        </div>

        {/* Discount Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Discount Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Discount Type *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="percentage"
                    checked={formData.type === 'percentage'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-4 h-4"
                  />
                  <Percent className="w-4 h-4" />
                  <span>Percentage (%)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="fixed"
                    checked={formData.type === 'fixed'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-4 h-4"
                  />
                  <DollarSign className="w-4 h-4" />
                  <span>Fixed Amount ($)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Discount Value *
              </label>
              <div className="relative">
                {formData.type === 'percentage' ? (
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                ) : (
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder={formData.type === 'percentage' ? '10' : '20'}
                  required
                />
              </div>
              {formData.type === 'percentage' && (
                <p className="text-xs text-gray-500 mt-1">Maximum discount cannot exceed 100%</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Minimum Purchase Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Leave 0 for no minimum requirement</p>
            </div>

            {formData.type === 'percentage' && (
              <div>
                <label className="block text-sm font-medium mb-2">Maximum Discount Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    placeholder="50"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum discount amount in dollars</p>
              </div>
            )}
          </div>
        </div>

        {/* Usage Limits */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Usage Limits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Total Usage Limit</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  min="1"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Maximum number of times this coupon can be used</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Per User Limit</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.perUserLimit}
                  onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  min="1"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">How many times each customer can use this coupon</p>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Valid Period</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">{`Inactive coupons won't be available to customers`}</p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 justify-end">
          <Link href="/admin/coupons">
            <button type="button" className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Creating...' : 'Create Coupon'}
          </button>
        </div>
      </form>
    </div>
  );
}