'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Home,
  Briefcase,
  AlertCircle,
  Loader2,
  ArrowLeft,
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
  type?: 'home' | 'work' | 'other';
}

export default function AddressesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    fetchAddresses();
  }, [session, router]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/user/addresses');
      const data = await response.json();
      
      if (data.success) {
        setAddresses(data.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/user/addresses/${addressId}/default`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const deleteAddress = async (addressId: string) => {
    setDeletingId(addressId);
    
    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const getAddressTypeIcon = (type?: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'work':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const AddressCard = ({ address, index }: { address: Address; index: number }) => {
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
          address.isDefault ? 'border-blue-500' : 'border-transparent'
        }`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                address.type === 'home' ? 'bg-green-100 text-green-600' :
                address.type === 'work' ? 'bg-purple-100 text-purple-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {getAddressTypeIcon(address.type)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {address.fullName}
                </h3>
                {address.type && (
                  <p className="text-xs text-gray-500 capitalize">{address.type}</p>
                )}
              </div>
            </div>
            
            {address.isDefault && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                <CheckCircle className="w-3 h-3" />
                Default
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-1">
            <p>{address.street}</p>
            <p>{address.city}, {address.state} {address.zipCode}</p>
            <p>{address.country}</p>
            <p className="mt-2">Phone: {address.phone}</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {!address.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDefaultAddress(address._id)}
              >
                Set as Default
              </Button>
            )}
            <Link href={`/account/addresses/${address._id}/edit`}>
              <Button variant="outline" size="sm" leftIcon={<Edit className="w-3 h-3" />}>
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(address._id)}
              leftIcon={<Trash2 className="w-3 h-3" />}
            >
              Delete
            </Button>
          </div>
        </div>
        
        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm === address._id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 m-4 max-w-sm">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold">Delete Address?</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Are you sure you want to delete this address? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={deletingId === address._id}
                    onClick={() => deleteAddress(address._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
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

  return (
    <>
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/account" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  My Addresses
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your shipping addresses
                </p>
              </div>
              <Link href="/account/addresses/add">
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                  Add New Address
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Addresses List */}
          {addresses.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
              <MapPin className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No addresses saved
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add your first address to make checkout faster
              </p>
              <Link href="/account/addresses/add">
                <Button variant="primary">Add Address</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address, idx) => (
                <AddressCard key={address._id} address={address} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
      
    </>
  );
}