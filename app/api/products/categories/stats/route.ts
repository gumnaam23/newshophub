import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const [totalCategories, totalProducts, popular, newCategories] = await Promise.all([
      Product.distinct('category').then(cats => cats.length),
      Product.countDocuments(),
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Product.aggregate([
        { $sort: { createdAt: -1 } },
        { $group: { _id: '$category', latestDate: { $max: '$createdAt' } } },
        { $sort: { latestDate: -1 } },
        { $limit: 5 }
      ])
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        totalCategories,
        totalProducts,
        popularCategories: popular,
        newCategories: newCategories
      }
    });
    
  } catch (error) {
    console.error('Category Stats Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}