import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Category } from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const categories = await Category.find({ isActive: true })
      .limit(limit);
    
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