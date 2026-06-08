'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Home,
  Briefcase,
  MapPin,
  User,
  Phone,
  Building,
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface Address {
  _id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export default function EditAddressPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const addressId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    isDefault: false,
    type: 'home' as 'home' | 'work' | 'other'
  });

  const addressTypes = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'work', label: 'Work', icon: Briefcase },
    { value: 'other', label: 'Other', icon: MapPin }
  ];

  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India', 'Other'];

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    fetchAddress();
  }, [session, router, addressId]);

  const fetchAddress = async () => {
    try {
      const response = await fetch(`/api/user/addresses/${addressId}`);
      const data = await response.json();
      
      if (data.success) {
        setAddress(data.data);
        setFormData({
          fullName: data.data.fullName,
          street: data.data.street,
          city: data.data.city,
          state: data.data.state,
          zipCode: data.data.zipCode,
          country: data.data.country,
          phone: data.data.phone,
          isDefault: data.data.isDefault,
          type: data.data.type || 'other'
        });
      } else {
        setError('Address not found');
        setTimeout(() => router.push('/account/addresses'), 2000);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setError('Failed to load address');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/account/addresses');
      } else {
        setError(data.error || 'Failed to update address');
      }
    } catch (error) {
      console.error(error)
      setError('Failed to update address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    setDeleting(true);
    
    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/account/addresses');
      } else {
        setError(data.error || 'Failed to delete address');
      }
    } catch (error) {
      console.error(error)
      setError('Failed to delete address');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  if (!address && !loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Address Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
             {` The address you're looking for doesn't exist.`}
            </p>
            <Link href="/account/addresses">
              <Button variant="primary">Back to Addresses</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/account/addresses" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Addresses
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Edit Address
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Update your shipping address details
                </p>
              </div>
              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={deleting}
                leftIcon={!deleting ? <Trash2 className="w-4 h-4" /> : undefined}
              >
                Delete
              </Button>
            </div>
          </div>
          
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
          >
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Address Type
                </label>
                <div className="flex gap-4">
                  {addressTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.value as 'home' | 'work' | 'other' })}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          isSelected ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <p className={`text-sm font-medium ${
                          isSelected ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {type.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Street Address *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="123 Main St"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="New York"
                  />
                </div>
                
                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="NY"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ZIP Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="10001"
                  />
                </div>
                
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
              
              {/* Set as Default */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700 dark:text-gray-300">
                  Set as default shipping address
                </label>
              </div>
              
              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={saving}
                  leftIcon={!saving ? <Save className="w-4 h-4" /> : undefined}
                >
                  Save Changes
                </Button>
                <Link href="/account/addresses">
                  <Button variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      
    </>
  );
}