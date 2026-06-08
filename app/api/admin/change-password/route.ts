import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { currentPassword, newPassword } = await request.json();

    const user = await User.findOne({ email: session.user.email }).select('+password');
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password Change Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to change password' }, { status: 500 });
  }
}