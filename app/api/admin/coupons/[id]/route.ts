import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';
import { auth } from '@/lib/auth';

export async function GET(
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

    const { id } = await params

    const coupon = await Coupon.findById(id).lean();

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: coupon
    });

  } catch (error) {
    console.error('Coupon Details API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupon' },
      { status: 500 }
    );
  }
}

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

    const { id } = await params

    const body = await request.json();

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: coupon,
      message: 'Coupon updated successfully'
    });

  } catch (error) {
    console.error('Update Coupon API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}