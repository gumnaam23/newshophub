import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { enabled } = await request.json();

    await User.findOneAndUpdate(
      { email: session.user.email },
      { twoFactorEnabled: enabled },
      { new: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      data: { twoFactorEnabled: enabled },
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`
    });

  } catch (error) {
    console.error('Two-Factor API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update two-factor authentication' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).select('twoFactorEnabled');
    
    return NextResponse.json({
      success: true,
      data: { twoFactorEnabled: user?.twoFactorEnabled || false }
    });

  } catch (error) {
    console.error('Two-Factor GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch two-factor status' },
      { status: 500 }
    );
  }
}