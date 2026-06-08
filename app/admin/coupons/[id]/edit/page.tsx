'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  CheckCircle
} from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function EditCouponPage() {
  const params = useParams();
  const router = useRouter();
  const couponId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<Coupon>({
    _id: '',
    code: '',
    description: '',
    type: 'percentage',
    value: 0,
    minPurchase: 0,
    maxDiscount: undefined,
    usageLimit: 1,
    usedCount: 0,
    perUserLimit: 1,
    startDate: '',
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupon();
  }, [couponId]);

  const fetchCoupon = async () => {
    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`);
      const data = await response.json();
      if (data.success) {
        setFormData({
          ...data.data,
          startDate: new Date(data.data.startDate).toISOString().split('T')[0],
          endDate: new Date(data.data.endDate).toISOString().split('T')[0]
        });
      } else {
        setError('Coupon not found');
      }
    } catch (error) {
      console.error(error)
      setError('Failed to load coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.type === 'percentage' && formData.value > 100) {
      setError('Percentage discount cannot exceed 100%');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Coupon updated successfully!');
        setTimeout(() => router.push('/admin/coupons'), 1500);
      } else {
        setError(data.error || 'Failed to update coupon');
      }
    } catch (error) {
      console.error(error)
      setError('Failed to update coupon');
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
        <Link href="/admin/coupons">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Coupon</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Update coupon details</p>
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
              <label className="block text-sm font-medium mb-2">Coupon Code</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
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
              <label className="block text-sm font-medium mb-2">Discount Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="percentage"
                    checked={formData.type === 'percentage'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' })}
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
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'fixed' })}
                    className="w-4 h-4"
                  />
                  <DollarSign className="w-4 h-4" />
                  <span>Fixed Amount ($)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Discount Value</label>
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
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Minimum Purchase Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>
            </div>

            {formData.type === 'percentage' && (
              <div>
                <label className="block text-sm font-medium mb-2">Maximum Discount Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maxDiscount || ''}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Usage Limits */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Usage Limits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Total Usage Limit</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Per User Limit</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.perUserLimit}
                  onChange={(e) => setFormData({ ...formData, perUserLimit: parseInt(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Times Used</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.usedCount}
                  disabled
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Valid Period</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
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
              <label className="block text-sm font-medium mb-2">End Date</label>
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