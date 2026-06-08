'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle, LucideIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

// Add missing imports
import { CreditCard, Wallet, Landmark, Smartphone } from 'lucide-react';
import CheckoutProgress from '../CheckoutProgress';import PaymentMethodCard from './PaymentMethodCard';
import CardPaymentForm from './CardPaymentForm';
import PayPalPayment from './PayPalPayment';
import BankTransferPayment from './BankTransferPayment';
import PaymentOrderSummary from './PaymentOrderSummary';




interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  carrier: string;
  estimatedDays: string;
}

interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount: number;
  description: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  enabled: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    icon: CreditCard,
    description: 'Pay securely with your card',
    enabled: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: Wallet,
    description: 'Pay with your PayPal account',
    enabled: true,
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: Landmark,
    description: 'Direct bank transfer',
    enabled: true,
  },
  {
    id: 'digital_wallet',
    name: 'Digital Wallet',
    icon: Smartphone,
    description: 'Google Pay, Apple Pay',
    enabled: false,
  },
];

export default function PaymentClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [saveCard, setSaveCard] = useState(false);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(
    null
  );
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login?from=/cart/checkout/payment');
      return;
    }

    const savedAddressId = sessionStorage.getItem('checkoutAddress');
    const savedShippingMethod = sessionStorage.getItem('shippingMethod');

    if (!savedAddressId || !savedShippingMethod) {
      router.push('/cart/checkout');
      return;
    }

    const fetchData = async () => {
      try {
        const cartRes = await fetch('/api/cart');
        const cartData = await cartRes.json();

        if (cartData.success) {
          setCartSummary(cartData.data.summary);
          setShippingMethod(JSON.parse(savedShippingMethod));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const savedCoupon = sessionStorage.getItem('checkoutCoupon');
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon));
    }
  }, [session, status, router]);

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

  const validateField = (field: string, value: string): boolean => {
    let error = '';

    switch (field) {
      case 'cardNumber':
        if (!value.replace(/\s/g, '').match(/^\d{16}$/)) {
          error = 'Please enter a valid 16-digit card number';
        }
        break;
      case 'cardName':
        if (!value.trim()) {
          error = 'Cardholder name is required';
        }
        break;
      case 'expiryDate':
        if (!value.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
          error = 'Please enter a valid expiry date (MM/YY)';
        } else {
          const [month, year] = value.split('/');
          const expiryDate = new Date(2000 + parseInt(year), parseInt(month));
          const today = new Date();
          if (expiryDate < today) {
            error = 'Card has expired';
          }
        }
        break;
      case 'cvv':
        if (!value.match(/^\d{3,4}$/)) {
          error = 'Please enter a valid CVV';
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateCard = (): boolean => {
    let isValid = true;
    const fields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];

    fields.forEach((field) => {
      const value = cardDetails[field as keyof typeof cardDetails];
      const isFieldValid = validateField(field, value);
      if (!isFieldValid) isValid = false;
      setTouched((prev) => ({ ...prev, [field]: true }));
    });

    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
    }

    setCardDetails((prev) => ({ ...prev, [field]: formattedValue }));

    if (touched[field]) {
      validateField(field, formattedValue);
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, cardDetails[field as keyof typeof cardDetails]);
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'Amex';
    if (number.startsWith('6')) return 'Discover';
    return 'Card';
  };

  const handlePlaceOrder = async () => {
    if (selectedMethod === 'card') {
      if (!validateCard()) {
        return;
      }
    }

    setProcessing(true);

    try {
      const addressId = sessionStorage.getItem('checkoutAddress');

      if (!addressId) {
        alert('Shipping address not found. Please go back to address selection.');
        router.push('/cart/checkout');
        return;
      }

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Address-Id': addressId,
        },
        body: JSON.stringify({
          paymentMethod: selectedMethod,
          cardDetails:
            selectedMethod === 'card'
              ? {
                  last4: cardDetails.cardNumber.slice(-4),
                  cardType: getCardType(cardDetails.cardNumber),
                }
              : null,
          saveCard,
          shippingMethod,
          total: cartSummary.total,
          couponCode: appliedCoupon?.code,
          discountAmount: appliedCoupon?.discount,
        }),
      });

      const orderData = await orderResponse.json();

      if (orderData.success) {
        sessionStorage.setItem('lastOrderId', orderData.data.orderId);
        await fetch('/api/cart/clear', { method: 'DELETE' });
        router.push(
          `/cart/checkout/confirmation?orderId=${orderData.data.orderId}`
        );
      } else {
        alert(orderData.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

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
        <CheckoutProgress currentStep={3} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Method
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {`Choose how you'd like to pay`}
              </p>

              <div className="space-y-3">
                {paymentMethods.map((method, idx) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    index={idx}
                    isSelected={selectedMethod === method.id}
                    onSelect={setSelectedMethod}
                  />
                ))}
              </div>

              <AnimatePresence>
                <CardPaymentForm
                  selectedMethod={selectedMethod}
                  cardDetails={cardDetails}
                  saveCard={saveCard}
                  errors={errors}
                  touched={touched}
                  onInputChange={handleInputChange}
                  onBlur={handleBlur}
                  onSaveCardChange={setSaveCard}
                />
              </AnimatePresence>

              <PayPalPayment selectedMethod={selectedMethod} />
              <BankTransferPayment selectedMethod={selectedMethod} />

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link href="/cart/checkout/shipping">
                  <Button
                    variant="outline"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back to Shipping
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  onClick={handlePlaceOrder}
                  isLoading={processing}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  disabled={processing}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <PaymentOrderSummary
              cartSummary={cartSummary}
              shippingMethod={shippingMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

