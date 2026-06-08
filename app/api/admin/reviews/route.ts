import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const query: Record<string, unknown> = {};
;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'pending') {
      query.isApproved = false;
    }

    const skip = (page - 1) * limit;
    
    const [reviews, total] = await Promise.all([
      Review.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('productId', 'name images')
        .populate('userId', 'name avatar')
        .lean(),
      Review.countDocuments(query)
    ]);
    console.log(reviews)

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Reviews API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}