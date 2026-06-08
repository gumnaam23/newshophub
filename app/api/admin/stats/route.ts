import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { Review } from '@/models/Review';
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

    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      totalReviews,
      pendingReviews,
      lowStockProducts,
      outOfStockProducts
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Product.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
      Review.countDocuments({ isApproved: false }),
      Product.countDocuments({ stock: { $gt: 0, $lt: 10 } }),
      Product.countDocuments({ stock: 0 })
    ]);

    // Recent activity
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .lean();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email avatar createdAt')
      .lean();

    const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name avatar')
      .populate('productId', 'name')
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalProducts,
          totalUsers,
          totalReviews,
          pendingReviews
        },
        inventory: {
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
          totalStock: totalProducts
        },
        recentActivity: {
          orders: recentOrders,
          users: recentUsers,
          reviews: recentReviews
        }
      }
    });

  } catch (error) {
    console.error('Admin Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}