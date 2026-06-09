import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { IUser, User } from '@/models/User';
import { Order } from '@/models/Order';
import { auth } from '@/lib/auth';
import { Types } from 'mongoose';

export async function GET(request: NextRequest) {
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
      .select('wishlist addresses')
      .lean<IUser>();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // ✅ Get order stats (total orders and total spent)
    const orderStats = await Order.aggregate([
      { 
        $match: { 
          userId: new Types.ObjectId(user._id),
          paymentStatus: 'paid'  // Only count paid orders
        } 
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' }
        }
      }
    ]);

    const stats = {
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalSpent: orderStats[0]?.totalSpent || 0,
      wishlistCount: user.wishlist?.length || 0,
      addressesCount: user.addresses?.length || 0
    };

    return NextResponse.json({
      success: true,
      data: stats  // ✅ Send exactly what frontend expects
    });

  } catch (error) {
    console.error('User Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}