import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const review = await Review.findById(id);
    
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    review.isApproved = true;
    await review.save();

    // Update product rating
    const approvedReviews = await Review.find({ 
      productId: review.productId, 
      isApproved: true 
    });
    
    const avgRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
    
    await Product.findByIdAndUpdate(review.productId, {
      rating: avgRating,
      reviewCount: approvedReviews.length
    });

    return NextResponse.json({
      success: true,
      message: 'Review approved successfully'
    });

  } catch (error) {
    console.error('Approve Review API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve review' },
      { status: 500 }
    );
  }
}