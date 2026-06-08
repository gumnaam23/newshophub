import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';
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

    const [stats, avgRating] = await Promise.all([
      Review.aggregate([
        {
          $group: {
            _id: '$isApproved',
            count: { $sum: 1 }
          }
        }
      ]),
      Review.aggregate([
        { $match: { isApproved: true } },
        {
          $group: {
            _id: null,
            average: { $avg: '$rating' }
          }
        }
      ])
    ]);

    const result = {
      total: 0,
      approved: 0,
      pending: 0,
      averageRating: avgRating[0]?.average || 0
    };

    stats.forEach(stat => {
      if (stat._id === true) result.approved = stat.count;
      if (stat._id === false) result.pending = stat.count;
      result.total += stat.count;
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Reviews Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}