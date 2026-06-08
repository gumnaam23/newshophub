'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Globe,
  DollarSign,
  Mail,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface Settings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  metaTitle: string;
  metaDescription: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFromEmail: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    currency: 'USD',
    taxRate: 10,
    freeShippingThreshold: 50,
    metaTitle: '',
    metaDescription: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    smtpFromEmail: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await response.json();
      if (data.success) {
        alert('Settings saved successfully');
        setSuccess('Settings saved successfully');
        setSettings({
          storeName: '',
          storeEmail: '',
          storePhone: '',
          storeAddress: '',
          currency: 'USD',
          taxRate: 10,
          freeShippingThreshold: 50,
          metaTitle: '',
          metaDescription: '',
          smtpHost: '',
          smtpPort: 587,
          smtpUser: '',
          smtpPass: '',
          smtpFromEmail: ''
        });
        setTimeout(() => setSuccess(''), 3000);

      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error(error)
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const testSmtp = async () => {
    try {
      const response = await fetch('/api/admin/settings/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: settings.smtpHost,
          port: settings.smtpPort,
          user: settings.smtpUser,
          pass: settings.smtpPass,
          fromEmail: settings.smtpFromEmail
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('SMTP connection successful!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'SMTP connection failed');
      }
    } catch (error) {
      console.error(error)
      setError('SMTP test failed');
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">General Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Configure your store settings</p>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Store Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Store Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Store Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Store Phone</label>
              <input
                type="tel"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Store Address</label>
              <textarea
                rows={2}
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Store Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Store Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Free Shipping Threshold ($)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Meta Title</label>
              <input
                type="text"
                value={settings.metaTitle}
                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <textarea
                rows={3}
                value={settings.metaDescription}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Email Settings (SMTP) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Mail className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email Settings (SMTP)</h2>
            </div>
            <button
              type="button"
              onClick={testSmtp}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw className="w-3 h-3" />
              Test Connection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">SMTP Host</label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SMTP Port</label>
              <input
                type="number"
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) })}
                placeholder="587"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SMTP Username</label>
              <input
                type="text"
                value={settings.smtpUser}
                onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SMTP Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={settings.smtpPass}
                  onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">From Email Address</label>
              <input
                type="email"
                value={settings.smtpFromEmail}
                onChange={(e) => setSettings({ ...settings, smtpFromEmail: e.target.value })}
                placeholder="noreply@yourstore.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}