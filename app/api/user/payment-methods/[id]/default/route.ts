import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth } from '@/lib/auth';


interface PaymentMethod {
  _id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  cardType?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardName?: string;
  isDefault: boolean;
  name: string;
  createdAt: Date;
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();      
     const params = await context.params

    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    // Check if payment method exists
    const paymentMethod = user.paymentMethods?.find((m: PaymentMethod) => m._id === params.id);
    if (!paymentMethod) {
      return NextResponse.json({ success: false, error: 'Payment method not found' }, { status: 404 });
    }
    
    // Remove default from all payment methods
    user.paymentMethods.forEach((method: PaymentMethod) => {
      method.isDefault = false;
    });
    
    // Set new default
    paymentMethod.isDefault = true;
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Default payment method updated successfully'
    });
  } catch (error) {
    console.error('Set default payment method error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set default payment method' },
      { status: 500 }
    );
  }
}