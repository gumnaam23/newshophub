import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';
import { auth } from '@/lib/auth';
import { User } from '@/models/User';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Find coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Check if coupon is expired
    const now = new Date();
    if (coupon.endDate < now) {
      return NextResponse.json(
        { success: false, error: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // Check if coupon has started
    if (coupon.startDate > now) {
      return NextResponse.json(
        { success: false, error: 'Coupon is not yet active' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: 'Coupon usage limit has been reached' },
        { status: 400 }
      );
    }

    // Check minimum purchase
    if (coupon.minPurchase > 0 && subtotal < coupon.minPurchase) {
      return NextResponse.json(
        { success: false, error: `Minimum purchase of $${coupon.minPurchase} required` },
        { status: 400 }
      );
    }

    // Check if user has already used this coupon
    const user = await User.findOne({ email: session.user.email });
    if (user && coupon.usedBy && coupon.usedBy.includes(user._id)) {
      const userUsageCount = coupon.usedBy.filter((id: Types.ObjectId) => id.toString() === user._id.toString()).length;
      if (userUsageCount >= coupon.perUserLimit) {
        return NextResponse.json(
          { success: false, error: `You have already used this coupon ${coupon.perUserLimit} time(s)` },
          { status: 400 }
        );
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    // Ensure discount doesn't exceed subtotal
    if (discount > subtotal) {
      discount = subtotal;
    }

    // Don't update usedCount here - will be updated when order is placed
    // Just return the discount amount

    return NextResponse.json({
      success: true,
      data: {
        couponId: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: discount,
        description: coupon.description,
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount
      },
      message: `Coupon applied! You saved $${discount.toFixed(2)}`
    });

  } catch (error) {
    console.error('Apply Coupon Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to apply coupon' },
      { status: 500 }
    );
  }
}