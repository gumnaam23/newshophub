import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          products: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          slug: '$_id',
          description: { $arrayElemAt: ['$products.description', 0] },
          image: { $arrayElemAt: ['$products.images', 0] },
          productCount: '$count',
          featured: { $cond: [{ $gte: ['$count', 10] }, true, false] },
          createdAt: { $min: '$products.createdAt' }
        }
      },
      { $sort: { productCount: -1 } }
    ]);
    
    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length
    });
    
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}