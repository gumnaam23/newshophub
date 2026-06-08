import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Search query must be at least 2 characters'
      });
    }
    
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    })
    .limit(limit)
    .lean();
    
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    });
    
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search products' },
      { status: 500 }
    );
  }
}