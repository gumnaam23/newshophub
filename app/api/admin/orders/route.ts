import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
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

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || '-createdAt';

    const query: Record<string, unknown> = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email avatar')
        .lean(),
      Order.countDocuments(query)
    ]);

    console.log(orders)
    // Get order statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$total' }
        }
      }
    ]);

    const statusStats = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'pending') statusStats.pending = stat.count;
      if (stat._id === 'processing') statusStats.processing = stat.count;
      if (stat._id === 'shipped') statusStats.shipped = stat.count;
      if (stat._id === 'delivered') {
        statusStats.delivered = stat.count;
        statusStats.totalRevenue += stat.total;
      }
      if (stat._id === 'cancelled') statusStats.cancelled = stat.count;
    });

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: statusStats
    });

  } catch (error) {
    console.error('Admin Orders API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}