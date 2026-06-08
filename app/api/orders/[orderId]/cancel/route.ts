import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
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


    const order = await Order.findById(params.orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if order can be cancelled
    if (order.status !== 'pending' && order.status !== 'processing') {
      return NextResponse.json(
        { success: false, error: 'Order cannot be cancelled' },
        { status: 400 }
      );
    }
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity }
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully'
    });
    
  } catch (error) {
    console.error('Order cancellation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}