import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email })
      .select('-password -resetToken -resetTokenExpiry')
      .lean();

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { name, phone } = await request.json();
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { name, phone },
      { new: true }
    ).select('-password');

    return NextResponse.json({ success: true, data: user, message: 'Profile updated' });
  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}