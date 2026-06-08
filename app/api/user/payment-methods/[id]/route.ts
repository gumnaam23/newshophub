import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { IPaymentMethod, User } from '@/models/User';
import { auth } from '@/lib/auth';


// GET - Fetch single payment method
export async function GET(
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
    
    const paymentMethod = user.paymentMethods?.find((m: IPaymentMethod) => m._id === params.id);
    if (!paymentMethod) {
      return NextResponse.json({ success: false, error: 'Payment method not found' }, { status: 404 });
    }
    
    const safeMethod = {
      _id: paymentMethod._id,
      type: paymentMethod.type,
      last4: paymentMethod.last4,
      cardType: paymentMethod.cardType,
      expiryMonth: paymentMethod.expiryMonth,
      expiryYear: paymentMethod.expiryYear,
      isDefault: paymentMethod.isDefault,
      name: paymentMethod.name
    };
    
    return NextResponse.json({
      success: true,
      data: safeMethod
    });
  } catch (error) {
    console.error('Fetch payment method error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment method' },
      { status: 500 }
    );
  }
}

// PUT - Update payment method
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
    
    const { isDefault, name } = await request.json();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    const paymentMethod = user.paymentMethods?.find((m: IPaymentMethod) => m._id === params.id);
    if (!paymentMethod) {
      return NextResponse.json({ success: false, error: 'Payment method not found' }, { status: 404 });
    }
    
    if (isDefault && !paymentMethod.isDefault) {
      user.paymentMethods.forEach((m: IPaymentMethod) => {
        m.isDefault = false;
      });
      paymentMethod.isDefault = true;
    }
    
    if (name) {
      paymentMethod.name = name;
    }
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Payment method updated successfully'
    });
  } catch (error) {
    console.error('Update payment method error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update payment method' },
      { status: 500 }
    );
  }
}

// DELETE - Remove payment method
export async function DELETE(
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
    
    const paymentMethod = user.paymentMethods?.find((m: IPaymentMethod) => m._id === params.id);
    if (!paymentMethod) {
      return NextResponse.json({ success: false, error: 'Payment method not found' }, { status: 404 });
    }
    
    const wasDefault = paymentMethod.isDefault;
    
    user.paymentMethods = user.paymentMethods.filter((m: IPaymentMethod) => m._id !== params.id);
    
    // If the deleted method was default and there are other methods, set first as default
    if (wasDefault && user.paymentMethods && user.paymentMethods.length > 0) {
      user.paymentMethods[0].isDefault = true;
    }
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}