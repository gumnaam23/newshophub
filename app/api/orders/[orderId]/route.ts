import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { IOrderItem, IShippingAddress, Order } from '@/models/Order';
import { auth } from '@/lib/auth';
import { User } from '@/models/User';
import { Types } from 'mongoose';

interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface PopulatedOrder {
  _id: string;
  orderNumber: string;
  userId: PopulatedUser;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  shippingAddress: IShippingAddress;
  trackingNumber?: string;
  carrier?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}


export async function GET(
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
    
    const order = await Order.findById(params.orderId)
      .populate<{ userId: PopulatedUser }>('userId', 'name email')
      .lean() as PopulatedOrder | null;
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the order or is admin
    const user = await User.findOne({ email: session.user.email });
    if (order.userId._id.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: order
    });
    
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}