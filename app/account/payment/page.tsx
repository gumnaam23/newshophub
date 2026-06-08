'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  X,
  Eye,
  EyeOff,
  Calendar,
  Shield
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface PaymentMethod {
  _id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  cardType?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  name: string;
}

export default function PaymentMethodsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  // Card form
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: true,
    setAsDefault: true
  });
  const [showCVV, setShowCVV] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    fetchPaymentMethods();
  }, [session, router]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/user/payment-methods');
      const data = await response.json();
      
      if (data.success) {
        setMethods(data.data);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const validateCard = () => {
    const newErrors: Record<string, string> = {};
    
    if (!cardDetails.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }
    
    if (!cardDetails.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
    if (!cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      newErrors.expiryDate = 'Enter valid expiry date (MM/YY)';
    } else {
      const [month, year] = cardDetails.expiryDate.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month));
      const today = new Date();
      if (expiryDate < today) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!cardDetails.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'Enter valid CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCard()) {
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      const response = await fetch('/api/user/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'card',
          cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
          cardName: cardDetails.cardName,
          expiryDate: cardDetails.expiryDate,
          cvv: cardDetails.cvv,
          setAsDefault: cardDetails.setAsDefault
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchPaymentMethods();
        setShowAddForm(false);
        setCardDetails({
          cardNumber: '',
          cardName: '',
          expiryDate: '',
          cvv: '',
          saveCard: true,
          setAsDefault: true
        });
      } else {
        setError(data.error || 'Failed to add card');
      }
    } catch (error) {
        console.error(error)
      setError('Failed to add payment method');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    
    try {
      const response = await fetch(`/api/user/payment-methods/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchPaymentMethods();
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/user/payment-methods/${id}/default`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchPaymentMethods();
      }
    } catch (error) {
      console.error('Error setting default:', error);
    }
  };

  const getCardIcon = (cardType: string) => {
    const icons: Record<string, string> = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳'
    };
    return icons[cardType?.toLowerCase()] || '💳';
  };

  const PaymentMethodCard = ({ method }: { method: PaymentMethod }) => {
    return (
      <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 transition-all ${
        method.isDefault ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl">
              {method.type === 'card' ? getCardIcon(method.cardType || '') : 
               method.type === 'paypal' ? '💰' : '🏦'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {method.type === 'card' ? `${method.cardType?.toUpperCase()} •••• ${method.last4}` :
                 method.type === 'paypal' ? 'PayPal Account' : 'Bank Account'}
              </p>
              <p className="text-sm text-gray-500">
                {method.name}
              </p>
              {method.expiryMonth && method.expiryYear && (
                <p className="text-xs text-gray-400">
                  Expires: {method.expiryMonth}/{method.expiryYear}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!method.isDefault && (
              <button
                onClick={() => handleSetDefault(method._id)}
                className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1"
              >
                Set Default
              </button>
            )}
            <button
              onClick={() => handleDelete(method._id)}
              disabled={deletingId === method._id}
              className="p-1 text-red-500 hover:text-red-600 transition-colors"
            >
              {deletingId === method._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        {method.isDefault && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Default
            </span>
          </div>
        )}
      </div>
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
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/account" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Payment Methods
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your saved payment methods
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowAddForm(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Payment Method
              </Button>
            </div>
          </div>
          
          {/* Payment Methods List */}
          {methods.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Payment Methods
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add your first payment method for faster checkout
              </p>
              <Button variant="primary" onClick={() => setShowAddForm(true)}>
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {methods.map((method) => (
                <PaymentMethodCard key={method._id} method={method} />
              ))}
            </div>
          )}
          
          {/* Security Note */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                Your payment information is secure
              </p>
              <p className="text-xs text-green-700 dark:text-green-500">
                All payment methods are encrypted and protected
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Payment Method Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Add Credit/Debit Card
                </h2>
                <button onClick={() => setShowAddForm(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleAddCard} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700`}
                      maxLength={19}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.cardName}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value.toUpperCase() })}
                      placeholder="JOHN DOE"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.cardName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700`}
                    />
                    {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={cardDetails.expiryDate}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: formatExpiryDate(e.target.value) })}
                          placeholder="MM/YY"
                          className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } dark:bg-gray-700`}
                          maxLength={5}
                        />
                      </div>
                      {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <div className="relative">
                        <input
                          type={showCVV ? 'text' : 'password'}
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/[^0-9]/g, '').slice(0, 4) })}
                          placeholder="123"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } dark:bg-gray-700`}
                          maxLength={4}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCVV(!showCVV)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showCVV ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                      {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="setAsDefault"
                      checked={cardDetails.setAsDefault}
                      onChange={(e) => setCardDetails({ ...cardDetails, setAsDefault: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="setAsDefault" className="text-sm">Set as default payment method</label>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" variant="primary" isLoading={saving}>
                      Add Card
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </>
  );
}