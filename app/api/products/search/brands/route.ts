import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';

type MatchStage = {
  category?: string;
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    let matchStage: MatchStage  = {};
    if (category) {
      matchStage = { category: category };
    }
    
    const brands = await Product.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$brand',
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
      data: brands
    });
    
  } catch (error) {
    console.error('Brands API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}