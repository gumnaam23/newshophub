import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';
import { Order } from '@/models/Order';
import { Types } from 'mongoose';
import { Coupon } from '@/models/Coupon';
import { sendOrderConfirmationEmail } from '@/lib/email-service';

// Local types
type AddressType = {
  _id?: Types.ObjectId;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

type CartItemType = {
  _id?: Types.ObjectId;
  productId: {
    _id: Types.ObjectId;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
  quantity: number;
  size?: string | null;
  color?: string | null;
  addedAt: Date;
};


// app/api/orders/route.ts (Updated POST method)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { paymentMethod, shippingMethod, couponCode, discountAmount } = await request.json();
    
    const user = await User.findOne({ email: session.user.email })
      .populate('cart.productId');
    
    if (!user || user.cart.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Get saved address from session storage
    const addressId = request.headers.get('x-address-id');
    const shippingAddress = user.addresses.find((addr: AddressType) => addr._id?.toString() === addressId);

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Shipping address not found' },
        { status: 400 }
      );
    }
    
    // Calculate totals
    const subtotal = user.cart.reduce((sum: number, item: CartItemType) => 
      sum + (item.productId.price * item.quantity), 0
    );
    const shipping = shippingMethod?.price || 0;
    const tax = (subtotal + shipping) * 0.1;
    const discount = discountAmount || 0;
    const total = subtotal + shipping + tax - discount;

    // If coupon is used, update coupon usage
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { 
          $inc: { usedCount: 1 },
          $push: { usedBy: user._id }
        }
      );
    }

    // Create order
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
    
    const order = await Order.create({
      orderNumber,
      userId: user._id,
      items: user.cart.map((item: CartItemType) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        image: item.productId.images[0]
      })),
      subtotal,
      shipping,
      tax,
      discount,
      total,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone
      },
      paymentMethod,
      paymentStatus: 'paid',
      status: 'processing',
      estimatedDelivery,
      couponCode: couponCode || null,
      discountAmount: discount
    });
    
    // Update product stock
    for (const item of user.cart) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity, soldCount: item.quantity }
      });
    }
    
    // Add order to user's orders
    user.orders.push(order._id);
    user.cart = [];
    await user.save();
    
    // Send order confirmation email
    // await sendOrderConfirmationEmail(
    //   user.email,
    //   user.name,
    //   order.orderNumber,
    //   order.items,
    //   order.total
    // );
    
    return NextResponse.json({
      success: true,
      data: { orderId: order._id, orderNumber: order.orderNumber }
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      success: true,
      data: orders
    });
    
  } catch (error) {
    console.error('Orders GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}