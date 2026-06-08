import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    if (!['user', 'seller', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    user.role = role;
    await user.save();

    return NextResponse.json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role },
      message: `User role updated to ${role}`
    });

  } catch (error) {
    console.error('Update User Role Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}