import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { IOrderItem, Order } from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { orderNumber, email } = await request.json();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { success: false, error: 'Order number and email are required' },
        { status: 400 }
      );
    }

    // Find order by order number
    const order = await Order.findOne({ orderNumber }).populate('userId');

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify email matches
    if (order.userId.email !== email) {  // ✅ Change: order.user → order.userId
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Build tracking information
    const trackingInfo = {
      orderNumber: order.orderNumber,
      status: order.status,
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      trackingUrl: order.trackingUrl,
      currentLocation: order.currentLocation,
      items: order.items.map((item: IOrderItem) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image
      })),
      statusHistory: [
        {
          status: 'order_placed',
          date: order.createdAt,
          description: 'Order has been placed successfully',
          location: 'Online'
        },
        {
          status: 'payment_confirmed',
          date: order.createdAt,
          description: 'Payment has been confirmed',
          location: 'Online'
        },
        ...(order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? [{
          status: 'processing',
          date: new Date(order.createdAt.getTime() + 86400000),
          description: 'Order is being processed',
          location: 'Warehouse'
        }] : []),
        ...(order.status === 'shipped' || order.status === 'delivered' ? [{
          status: 'shipped',
          date: new Date(order.createdAt.getTime() + 172800000),
          description: 'Order has been shipped',
          location: 'Shipping Facility'
        }] : []),
        ...(order.status === 'delivered' ? [{
          status: 'delivered',
          date: order.estimatedDelivery,
          description: 'Order has been delivered',
          location: order.shippingAddress?.city
        }] : [])
      ].filter(Boolean)
    };

    return NextResponse.json({
      success: true,
      data: trackingInfo
    });
  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track order' },
      { status: 500 }
    );
  }
}