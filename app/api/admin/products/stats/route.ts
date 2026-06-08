import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
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

    const stats = await Product.aggregate([
      {
        $facet: {
          totalStats: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalStock: { $sum: '$stock' },
                totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
                averagePrice: { $avg: '$price' }
              }
            }
          ],
          stockStats: [
            {
              $group: {
                _id: null,
                lowStock: {
                  $sum: { $cond: [{ $and: [{ $gt: ['$stock', 0] }, { $lt: ['$stock', 10] }] }, 1, 0] }
                },
                outOfStock: {
                  $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] }
                },
                inStock: {
                  $sum: { $cond: [{ $gt: ['$stock', 0] }, 1, 0] }
                }
              }
            }
          ],
          categoryStats: [
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 },
                totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          topSelling: [
            { $sort: { soldCount: -1 } },
            { $limit: 5 },
            {
              $project: {
                name: 1,
                soldCount: 1,
                revenue: { $multiply: ['$price', '$soldCount'] }
              }
            }
          ],
          recentProducts: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                name: 1,
                price: 1,
                stock: 1,
                createdAt: 1
              }
            }
          ]
        }
      }
    ]);

    const result = stats[0];
    
    return NextResponse.json({
      success: true,
      data: {
        overview: result.totalStats[0] || {
          totalProducts: 0,
          totalStock: 0,
          totalValue: 0,
          averagePrice: 0
        },
        stock: result.stockStats[0] || {
          lowStock: 0,
          outOfStock: 0,
          inStock: 0
        },
        categories: result.categoryStats || [],
        topSelling: result.topSelling || [],
        recentProducts: result.recentProducts || []
      }
    });

  } catch (error) {
    console.error('Products Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}