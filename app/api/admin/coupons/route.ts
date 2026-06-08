import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';
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
    
    if (search) {
      query.code = { $regex: search, $options: 'i' };
    }
    
    const now = new Date();
    if (status === 'active') {
      query.isActive = true;
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    } else if (status === 'expired') {
      query.endDate = { $lt: now };
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const skip = (page - 1) * limit;
    
    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Coupon.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Coupons API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: body.code });
    if (existingCoupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.create({
      ...body,
      usedCount: 0,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      data: coupon,
      message: 'Coupon created successfully'
    });

  } catch (error) {
    console.error('Create Coupon API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}