import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';
import { Order } from '@/models/Order';
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

    const now = new Date();

    const [totalCoupons, activeCoupons, expiredCoupons] = await Promise.all([
      Coupon.countDocuments(),
      Coupon.countDocuments({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
      }),
      Coupon.countDocuments({
        endDate: { $lt: now }
      })
    ]);

    // Calculate total savings from coupon usage
    const orders = await Order.find({ couponCode: { $exists: true } });
    const totalSavings = orders.reduce((sum, order) => sum + (order.discountAmount || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        total: totalCoupons,
        active: activeCoupons,
        expired: expiredCoupons,
        totalSavings
      }
    });

  } catch (error) {
    console.error('Coupons Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupon stats' },
      { status: 500 }
    );
  }
}