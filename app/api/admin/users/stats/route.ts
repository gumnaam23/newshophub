import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const [roleStats, orderStats] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: { userId: { $ne: null } } // ✅ Filter out null userIds
        },
        {
          $group: {
            _id: '$userId', // ✅ Use userId instead of user
            total: { $sum: '$total' }
          }
        }
      ])
    ]);

    const stats = {
      total: 0,
      admin: 0,
      user: 0,
      seller: 0
    };

    roleStats.forEach(stat => {
      stats[stat._id as keyof typeof stats] = stat.count;
      stats.total += stat.count;
    });

    const totalSpentByUser = new Map();
    orderStats.forEach(stat => {
      // ✅ Check if _id exists before calling toString()
      if (stat._id) {
        totalSpentByUser.set(stat._id.toString(), stat.total);
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        stats,
        userSpending: Object.fromEntries(totalSpentByUser)
      }
    });

  } catch (error) {
    console.error('Users Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}