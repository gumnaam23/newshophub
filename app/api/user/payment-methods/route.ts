import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { IPaymentMethod, User } from '@/models/User';
import { auth } from '@/lib/auth';
import crypto from 'crypto';

function getCardType(cardNumber: string): string {
  const number = cardNumber.replace(/\s/g, '');
  if (number.startsWith('4')) return 'visa';
  if (number.startsWith('5')) return 'mastercard';
  if (number.startsWith('3')) return 'amex';
  if (number.startsWith('6')) return 'discover';
  return 'card';
}

// GET - Fetch all payment methods
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    // Return payment methods without encrypted data
    const safePaymentMethods = user.paymentMethods?.map((method: IPaymentMethod) => ({
      _id: method._id,
      type: method.type,
      last4: method.last4,
      cardType: method.cardType,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      isDefault: method.isDefault,
      name: method.name,
      createdAt: method.createdAt
    })) || [];
    
    return NextResponse.json({
      success: true,
      data: safePaymentMethods
    });
  } catch (error) {
    console.error('Fetch payment methods error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}

// POST - Add new payment method
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { type, cardNumber, cardName, expiryDate, cvv, setAsDefault } = await request.json();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    // Initialize paymentMethods array if it doesn't exist
    if (!user.paymentMethods) {
      user.paymentMethods = [];
    }
    
    // Encrypt card information (simplified - use proper encryption in production)
    const encryptedCard = crypto.createHash('sha256').update(cardNumber + Date.now().toString()).digest('hex');
    
    const [month, year] = expiryDate.split('/');
    const cardType = getCardType(cardNumber);
    const last4 = cardNumber.slice(-4);
    
    const newPaymentMethod = {
      _id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'card',
      last4: last4,
      cardType: cardType,
      expiryMonth: parseInt(month),
      expiryYear: parseInt(year),
      encryptedCard: encryptedCard,
      cardName: cardName.toUpperCase(),
      isDefault: setAsDefault || user.paymentMethods.length === 0,
      name: `${cardType.toUpperCase()} ending in ${last4}`,
      createdAt: new Date()
    };
    
    // If this is set as default, remove default from others
    if (newPaymentMethod.isDefault) {
      user.paymentMethods.forEach((method: IPaymentMethod) => {
        method.isDefault = false;
      });
    }
    
    user.paymentMethods.push(newPaymentMethod);
    await user.save();
    
    // Return safe data without encrypted card
    const safeMethod = {
      _id: newPaymentMethod._id,
      type: newPaymentMethod.type,
      last4: newPaymentMethod.last4,
      cardType: newPaymentMethod.cardType,
      expiryMonth: newPaymentMethod.expiryMonth,
      expiryYear: newPaymentMethod.expiryYear,
      isDefault: newPaymentMethod.isDefault,
      name: newPaymentMethod.name,
      createdAt: newPaymentMethod.createdAt
    };
    
    return NextResponse.json({
      success: true,
      data: safeMethod,
      message: 'Payment method added successfully'
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add payment method' },
      { status: 500 }
    );
  }
}

// DELETE - Remove all payment methods (admin only)
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    await User.updateMany({}, { $set: { paymentMethods: [] } });
    
    return NextResponse.json({
      success: true,
      message: 'All payment methods cleared'
    });
  } catch (error) {
    console.error('Clear payment methods error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear payment methods' },
      { status: 500 }
    );
  }
}