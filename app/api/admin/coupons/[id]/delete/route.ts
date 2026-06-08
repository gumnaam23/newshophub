import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';
import { auth } from '@/lib/auth';

export async function DELETE(
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

    const coupon = await Coupon.findById(id);
    
    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Check if coupon has been used
    if (coupon.usedCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete a coupon that has been used' },
        { status: 400 }
      );
    }

    await Coupon.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully'
    });

  } catch (error) {
    console.error('Delete Coupon API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}