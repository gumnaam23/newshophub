import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
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
    const role = searchParams.get('role');
    const sortBy = searchParams.get('sortBy') || '-createdAt';

    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') {
      query.role = role;
    }

    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select('-password -resetToken -resetTokenExpiry -accounts')
        .lean(),
      User.countDocuments(query)
    ]);

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      total: total,
      admin: 0,
      user: 0,
      seller: 0
    };

    userStats.forEach(stat => {
      if (stat._id === 'admin') stats.admin = stat.count;
      if (stat._id === 'user') stats.user = stat.count;
      if (stat._id === 'seller') stats.seller = stat.count;
    });

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    });

  } catch (error) {
    console.error('Admin Users API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}