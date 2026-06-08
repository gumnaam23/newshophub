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
          count: 1
        }
      },
      { $sort: { name: 1 } }
    ]);
    
    return NextResponse.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}