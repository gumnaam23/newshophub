import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { auth } from '@/lib/auth';
import { sendOrderShippedEmail } from '@/lib/email-service';

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

        const { id } = await params;
        const order = await Order.findById(id)
            .populate('userId', 'name email avatar')
            .populate('items.productId', 'name images')
            .lean();

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Admin Order Details API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch order' },
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

        const { id } = await params;

        const { status, trackingNumber, carrier, notes } = await request.json();

        const order = await Order.findById(id)
            .populate('userId', 'name email avatar')  
            .populate('items.productId', 'name images')
            .lean();

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        const previousStatus = order.status;
        order.status = status || order.status;

        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (carrier) order.carrier = carrier;
        if (notes) order.adminNotes = notes;

        await order.save();

        // Send email notification when order is shipped
        if (status === 'shipped' && previousStatus !== 'shipped') {
            await sendOrderShippedEmail(
                order.user.email,
                order.user.name,
                order.orderNumber,
                trackingNumber || order.trackingNumber,
                carrier || order.carrier,
                `https://shophub.com/track-order?order=${order.orderNumber}`
            );
        }

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order updated successfully'
        });

    } catch (error) {
        console.error('Admin Order Update API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        );
    }
}