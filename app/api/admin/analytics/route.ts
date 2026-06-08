import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month';
    
    const startDate = new Date();
    const previousStartDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        previousStartDate.setDate(previousStartDate.getDate() - 14);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        previousStartDate.setMonth(previousStartDate.getMonth() - 2);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 2);
        break;
    }

    // Current period data
    const [currentRevenue, currentOrders, currentUsers] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } }, // ✅ Use paymentStatus
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments({ createdAt: { $gte: startDate } })
    ]);

    // Previous period data
    const [previousRevenue, previousOrders, previousUsers] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: previousStartDate, $lt: startDate }, paymentStatus: 'paid' } }, // ✅ Use paymentStatus
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.countDocuments({ createdAt: { $gte: previousStartDate, $lt: startDate } }),
      User.countDocuments({ createdAt: { $gte: previousStartDate, $lt: startDate } })
    ]);

    // Top products
    const topProducts = await Product.aggregate([
      { $sort: { soldCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: 1,
          soldCount: 1,
          price: 1,
          revenue: { $multiply: ['$price', { $ifNull: ['$soldCount', 0] }] },
          image: { $arrayElemAt: ['$images', 0] }
        }
      }
    ]);

    // Top categories
    const topCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          revenue: { $sum: { $multiply: ['$price', { $ifNull: ['$soldCount', 0] }] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: '$_id',
          count: 1,
          revenue: 1
        }
      }
    ]);

    // ✅ Fixed Customer insights
    const allOrders = await Order.find()
      .populate('userId', '_id')
      .lean();
    
    const userOrderCount = new Map<string, number>();
    
    allOrders.forEach(order => {
      const userId = order.userId?._id?.toString() || order.userId?.toString();
      if (userId) {
        userOrderCount.set(userId, (userOrderCount.get(userId) || 0) + 1);
      }
    });

    const totalUniqueUsers = userOrderCount.size;
    const returningUsersCount = Array.from(userOrderCount.values()).filter(count => count > 1).length;
    const returningCustomerRate = totalUniqueUsers > 0 
      ? Math.round((returningUsersCount / totalUniqueUsers) * 100) 
      : 0;
    
    const totalOrdersCount = await Order.countDocuments();
    const totalRevenue = currentRevenue[0]?.total || 0;
    const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

    const customerInsights = {
      totalCustomers: totalUniqueUsers,
      newCustomers: currentUsers,
      returningCustomers: returningUsersCount,
      returningCustomerRate: returningCustomerRate,
      averageOrderValue: averageOrderValue
    };

    // Calculate conversion rate (orders / total users)
    const totalUsers = await User.countDocuments();
    const conversionRate = totalUsers > 0 ? (totalOrdersCount / totalUsers) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        revenue: {
          total: currentRevenue[0]?.total || 0,
          change: previousRevenue[0]?.total 
            ? ((currentRevenue[0]?.total - previousRevenue[0].total) / previousRevenue[0].total) * 100 
            : 0
        },
        orders: {
          total: currentOrders,
          change: previousOrders 
            ? ((currentOrders - previousOrders) / previousOrders) * 100 
            : 0
        },
        users: {
          total: currentUsers,
          change: previousUsers 
            ? ((currentUsers - previousUsers) / previousUsers) * 100 
            : 0
        },
        conversion: {
          rate: conversionRate,
          change: 0
        },
        topProducts: topProducts.map(p => ({
          _id: p._id,
          name: p.name,
          soldCount: p.soldCount || 0,
          revenue: p.revenue || 0,
          image: p.image
        })),
        topCategories: topCategories.map(c => ({
          name: c.name || 'Uncategorized',
          count: c.count,
          revenue: c.revenue
        })),
        customerInsights
      }
    });
    
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}