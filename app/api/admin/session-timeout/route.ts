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

    const { timeout } = await request.json();

    await User.findOneAndUpdate(
      { email: session.user.email },
      { sessionTimeout: timeout },
      { new: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      data: { sessionTimeout: timeout },
      message: 'Session timeout updated successfully'
    });

  } catch (error) {
    console.error('Session Timeout API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update session timeout' },
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

    const user = await User.findOne({ email: session.user.email }).select('sessionTimeout');
    
    return NextResponse.json({
      success: true,
      data: { sessionTimeout: user?.sessionTimeout || 60 }
    });

  } catch (error) {
    console.error('Session Timeout GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch session timeout' },
      { status: 500 }
    );
  }
}