'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
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
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount: number;
  description: string;
}

interface AddressFormData {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function CheckoutClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0
  });
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  // Fetch data
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login?from=/cart/checkout');
      return;
    }
    
    const fetchData = async () => {
      try {
        // Get cart data
        const cartRes = await fetch('/api/cart');
        const cartData = await cartRes.json();
        
        // Get addresses
        const addressesRes = await fetch('/api/user/addresses');
        const addressesData = await addressesRes.json();
        
        // Get applied coupon from session storage
        const savedCoupon = sessionStorage.getItem('appliedCoupon');
        let coupon = null;
        if (savedCoupon) {
          coupon = JSON.parse(savedCoupon);
          setAppliedCoupon(coupon);
        }
        
        if (cartData.success) {
          const cartSummary = cartData.data.summary;
          
          let discountAmount = 0;
          let finalTotal = cartSummary.total;
          
          if (coupon && coupon.discount > 0) {
            discountAmount = coupon.discount;
            finalTotal = cartSummary.subtotal + cartSummary.shipping + cartSummary.tax - discountAmount;
            
            setSummary({
              subtotal: cartSummary.subtotal,
              shipping: cartSummary.shipping,
              tax: cartSummary.tax,
              discount: discountAmount,
              total: finalTotal
            });
          } else {
            setSummary({
              subtotal: cartSummary.subtotal,
              shipping: cartSummary.shipping,
              tax: cartSummary.tax,
              discount: 0,
              total: cartSummary.total
            });
          }
          
          setCartItems(cartData.data.items);
        }
        
        if (addressesData.success) {
          setAddresses(addressesData.data);
          const defaultAddress = addressesData.data.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress._id);
          } else if (addressesData.data.length > 0) {
            setSelectedAddress(addressesData.data[0]._id);
          }
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [session, status, router]);

  const handleSaveAddress = async (formData: AddressFormData) => {
    setSavingAddress(true);
    
    try {
      const url = editingAddress ? `/api/user/addresses/${editingAddress._id}` : '/api/user/addresses';
      const method = editingAddress ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh addresses
        const addressesRes = await fetch('/api/user/addresses');
        const addressesData = await addressesRes.json();
        if (addressesData.success) {
          setAddresses(addressesData.data);
          if (formData.isDefault || addressesData.data.length === 1) {
            setSelectedAddress(data.data._id);
          }
        }
        
        setShowAddressForm(false);
        setEditingAddress(null);
      }
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        const addressesRes = await fetch('/api/user/addresses');
        const addressesData = await addressesRes.json();
        if (addressesData.success) {
          setAddresses(addressesData.data);
          if (selectedAddress === addressId && addressesData.data.length > 0) {
            setSelectedAddress(addressesData.data[0]._id);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleProceedToShipping = () => {
    if (!selectedAddress) {
      alert('Please select a shipping address');
      return;
    }
    
    // Store selected address and coupon in session storage
    sessionStorage.setItem('checkoutAddress', selectedAddress);
    if (appliedCoupon) {
      sessionStorage.setItem('checkoutCoupon', JSON.stringify(appliedCoupon));
    }
    
    router.push('/cart/checkout/shipping');
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleCancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const getInitialAddressForm = (): AddressFormData => ({
    fullName: session?.user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    isDefault: addresses.length === 0
  });

  const getEditAddressForm = (address: Address): AddressFormData => ({
    fullName: address.fullName,
    street: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
    phone: address.phone,
    isDefault: address.isDefault
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <CheckoutProgress currentStep={1} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Shipping Address
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddAddress}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add New Address
                </Button>
              </div>
              
              {addresses.length === 0 && !showAddressForm ? (
                <EmptyAddress
                  userName={session?.user?.name}
                  onAddAddress={handleAddAddress}
                />
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address._id}
                      address={address}
                      isSelected={selectedAddress === address._id}
                      onSelect={setSelectedAddress}
                      onEdit={handleEditAddress}
                      onDelete={handleDeleteAddress}
                    />
                  ))}
                </div>
              )}
              
              {/* Address Form */}
              {showAddressForm && (
                <AddressForm
                  initialData={editingAddress ? getEditAddressForm(editingAddress) : getInitialAddressForm()}
                  isEditing={!!editingAddress}
                  isSaving={savingAddress}
                  onSave={handleSaveAddress}
                  onCancel={handleCancelAddressForm}
                />
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link href="/cart">
                  <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back to Cart
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  onClick={handleProceedToShipping}
                  disabled={!selectedAddress}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Shipping
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div>
            <OrderSummary
              cartItems={cartItems}
              summary={summary}
              appliedCoupon={appliedCoupon}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Add missing imports
import { Plus } from 'lucide-react';
import CheckoutProgress from './CheckoutProgress';import EmptyAddress from './EmptyAddress';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import OrderSummary from './OrderSummary';

