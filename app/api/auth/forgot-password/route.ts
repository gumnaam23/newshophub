import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email });
    
    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a reset link will be sent'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    
    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, user.name, resetUrl);
    
    return NextResponse.json({
      success: true,
      message: 'Password reset email sent'
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}