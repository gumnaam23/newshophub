import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { token, password } = await request.json();
    
    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successful'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}