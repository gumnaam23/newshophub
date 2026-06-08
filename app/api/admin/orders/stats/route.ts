import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { auth } from '@/lib/auth';

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

    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$total' }
        }
      }
    ]);

    const result = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'pending') result.pending = stat.count;
      if (stat._id === 'processing') result.processing = stat.count;
      if (stat._id === 'shipped') result.shipped = stat.count;
      if (stat._id === 'delivered') {
        result.delivered = stat.count;
        result.totalRevenue = stat.total;
      }
      if (stat._id === 'cancelled') result.cancelled = stat.count;
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Orders Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order stats' },
      { status: 500 }
    );
  }
}