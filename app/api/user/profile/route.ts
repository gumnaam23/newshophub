import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { IPaymentMethod, User } from '@/models/User';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email })
      .select('-password -resetToken -resetTokenExpiry -accounts')
      .lean();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove encrypted data from payment methods
    if (user.paymentMethods) {
      user.paymentMethods = user.paymentMethods.map((method: IPaymentMethod) => {
        const { encryptedCard, ...safeMethod } = method;
        return safeMethod;
      });
    }
    
    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { name, phone } = await request.json();
    
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password -resetToken -resetTokenExpiry -accounts -paymentMethods.encryptedCard');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}