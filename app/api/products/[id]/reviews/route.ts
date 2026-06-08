import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await context.params

    const reviews = await Review.find({ productId: params.id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.error('Reviews API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const params = await context.params

    const { rating, title, comment } = await request.json();

    if (!rating || !title || !comment) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

      const existingReview = await Review.findOne({
      productId: params.id,
      userId: session.user.id
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    console.log({
      productId: params.id,
      userId: session.user.id,
      rating,
      title,
      comment,
      createdAt: new Date()
    }, "<<<<<<<<<<<<<<")

    const review = await Review.create({
      productId: params.id,
      userId: session.user.id,
      rating,
      title,
      comment,
      createdAt: new Date()
    });

    // Update product rating
    const reviews = await Review.find({ productId: params.id });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(params.id, {
      rating: avgRating,
      reviewCount: reviews.length
    });

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review submitted successfully'
    });

  } catch (error) {
    console.error('Create Review Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}