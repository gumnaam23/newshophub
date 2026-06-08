import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { auth } from '@/lib/auth';
import { Types } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const userId = id

    const [user, orders, orderStats, wishlistCount, addressesCount] = await Promise.all([
      User.findById(userId).select('-password -resetToken -resetTokenExpiry').lean(),
      Order.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
      Order.aggregate([
        { $match: { userId: new Types.ObjectId(userId), paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      User.findById(userId).select('wishlist').lean(),
      User.findById(userId).select('addresses').lean()
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const totalSpent = orderStats[0]?.total || 0;
    const ordersCount = await Order.countDocuments({ userId });

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        ordersCount: ordersCount || 0,
        totalSpent: totalSpent || 0,
        wishlistCount: wishlistCount?.wishlist?.length || 0,
        addressesCount: addressesCount?.addresses?.length || 0,
        recentOrders: orders.map(order => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          total: order.total || 0,
          status: order.status || 'pending',
          createdAt: order.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('User Details API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}