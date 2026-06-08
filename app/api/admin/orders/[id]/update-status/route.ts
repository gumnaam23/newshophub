import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';
import { sendOrderShippedEmail } from '@/lib/email-service';

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

    const { status, trackingNumber, carrier, notes } = await request.json();

    const order = await Order.findById(id).populate('userId', 'name email');

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const previousStatus = order.status;
    order.status = status;
    
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (notes) order.adminNotes = notes;

    // If order is cancelled, restore stock
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity }
        });
      }
    }

    await order.save();

    // Send email notification when order is shipped
    if (status === 'shipped' && previousStatus !== 'shipped') {
      await sendOrderShippedEmail(
        order.userId.email,
        order.userId.name,
        order.orderNumber,
        trackingNumber || order.trackingNumber,
        carrier || order.carrier,
        `https://shophub.com/track-order?order=${order.orderNumber}`
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`
    });

  } catch (error) {
    console.error('Update Order Status Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}