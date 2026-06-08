import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { action, productIds, data } = await request.json();

    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No products selected' },
        { status: 400 }
      );
    }

    let result;
    
    switch (action) {
      case 'delete':
        // Check if any products are in orders
        const Order = (await import('@/models/Order')).Order;
        const ordersWithProducts = await Order.findOne({
          'items.productId': { $in: productIds }
        });
        
        if (ordersWithProducts) {
          return NextResponse.json(
            { success: false, error: 'Some products cannot be deleted as they have been ordered' },
            { status: 400 }
          );
        }
        
        result = await Product.deleteMany({ _id: { $in: productIds } });
        break;
        
      case 'update-stock':
        if (data.stock === undefined) {
          return NextResponse.json(
            { success: false, error: 'Stock value is required' },
            { status: 400 }
          );
        }
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { stock: data.stock, updatedAt: new Date() } }
        );
        break;
        
      case 'update-price':
        if (data.price === undefined) {
          return NextResponse.json(
            { success: false, error: 'Price value is required' },
            { status: 400 }
          );
        }
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { price: data.price, updatedAt: new Date() } }
        );
        break;
        
      case 'update-category':
        if (!data.category) {
          return NextResponse.json(
            { success: false, error: 'Category is required' },
            { status: 400 }
          );
        }
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { category: data.category, updatedAt: new Date() } }
        );
        break;
        
      case 'featured':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { isFeatured: data.value, updatedAt: new Date() } }
        );
        break;
        
      case 'status':
        if (data.status === 'active') {
          result = await Product.updateMany(
            { _id: { $in: productIds } },
            { $set: { stock: { $gt: 0 }, updatedAt: new Date() } }
          );
        } else if (data.status === 'inactive') {
          result = await Product.updateMany(
            { _id: { $in: productIds } },
            { $set: { stock: 0, updatedAt: new Date() } }
          );
        }
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Bulk ${action} completed successfully`
    });

  } catch (error) {
    console.error('Bulk Product Operation Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}