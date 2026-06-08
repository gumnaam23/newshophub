import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
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
    const range = searchParams.get('range') || 'month';
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    const previousStartDate = new Date();
    
    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        previousStartDate.setDate(now.getDate() - 14);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        previousStartDate.setMonth(now.getMonth() - 2);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        previousStartDate.setFullYear(now.getFullYear() - 2);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
        previousStartDate.setMonth(now.getMonth() - 2);
    }

    // Fetch current period data
    const [currentOrders, currentProducts, currentUsers, currentRevenue] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      Product.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } }, // ✅ Use paymentStatus instead of status
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    // Fetch previous period data for comparison
    const [previousOrders, previousUsers, previousRevenue] = await Promise.all([
      Order.countDocuments({ 
        createdAt: { $gte: previousStartDate, $lt: startDate } 
      }),
      User.countDocuments({ 
        createdAt: { $gte: previousStartDate, $lt: startDate } 
      }),
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: previousStartDate, $lt: startDate },
            paymentStatus: 'paid' // ✅ Use paymentStatus instead of status
          } 
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    // Calculate changes
    const revenueChange = previousRevenue[0]?.total 
      ? ((currentRevenue[0]?.total || 0) - previousRevenue[0].total) / previousRevenue[0].total * 100
      : 100;
    
    const ordersChange = previousOrders 
      ? ((currentOrders - previousOrders) / previousOrders) * 100 
      : 100;
    
    const usersChange = previousUsers 
      ? ((currentUsers - previousUsers) / previousUsers) * 100 
      : 100;

    // ✅ Fetch recent orders with proper populate
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .lean();

    // ✅ Fix top products revenue calculation
    const topProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'items.productId',
          as: 'orders'
        }
      },
      {
        $project: {
          name: 1,
          price: 1,
          images: 1,
          stock: 1,
          soldCount: {
            $sum: {
              $reduce: {
                input: '$orders',
                initialValue: 0,
                in: {
                  $sum: {
                    $map: {
                      input: '$$this.items',
                      as: 'item',
                      in: {
                        $cond: [
                          { $eq: ['$$item.productId', '$_id'] },
                          '$$item.quantity',
                          0
                        ]
                      }
                    }
                  }
                }
              }
            }
          },
          revenue: {
            $sum: {
              $reduce: {
                input: '$orders',
                initialValue: 0,
                in: {
                  $sum: {
                    $map: {
                      input: '$$this.items',
                      as: 'item',
                      in: {
                        $cond: [
                          { $eq: ['$$item.productId', '$_id'] },
                          { $multiply: ['$$item.price', '$$item.quantity'] },
                          0
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      { $sort: { soldCount: -1 } },
      { $limit: 5 }
    ]);

    // Fetch recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email avatar createdAt')
      .lean();

    // Fetch low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .sort({ stock: 1 })
      .limit(5)
      .select('name stock images')
      .lean();

    // Fetch sales data for chart
    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: currentRevenue[0]?.total || 0,
        totalOrders: currentOrders,
        totalProducts: currentProducts,
        totalUsers: currentUsers,
        revenueChange: Math.round(revenueChange),
        ordersChange: Math.round(ordersChange),
        productsChange: 0,
        usersChange: Math.round(usersChange),
        recentOrders: recentOrders.map(order => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          user: order.userId // ✅ Already populated
        })),
        topProducts: topProducts.map(product => ({
          _id: product._id,
          name: product.name,
          soldCount: product.soldCount || 0,
          revenue: product.revenue || 0,
          image: product.images?.[0] || '/api/placeholder/50/50'
        })),
        recentUsers: recentUsers.map(user => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        })),
        lowStockProducts: lowStockProducts.map(product => ({
          _id: product._id,
          name: product.name,
          stock: product.stock,
          image: product.images?.[0] || '/api/placeholder/50/50'
        })),
        salesData: salesData.map(day => ({
          date: day._id,
          revenue: day.revenue,
          orders: day.orders
        }))
      }
    });

  } catch (error) {
    console.error('Admin Dashboard API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}