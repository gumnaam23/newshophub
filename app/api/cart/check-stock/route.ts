import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';

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
    
    const { items } = await request.json();
    
    const stockStatus = [];
    let allAvailable = true;
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        stockStatus.push({
          productId: item.productId,
          available: false,
          message: 'Product not found',
          requestedQuantity: item.quantity
        });
        allAvailable = false;
      } else if (product.stock < item.quantity) {
        stockStatus.push({
          productId: item.productId,
          name: product.name,
          available: false,
          availableStock: product.stock,
          requestedQuantity: item.quantity,
          message: `Only ${product.stock} items available`
        });
        allAvailable = false;
      } else {
        stockStatus.push({
          productId: item.productId,
          name: product.name,
          available: true,
          availableStock: product.stock,
          requestedQuantity: item.quantity,
          price: product.price
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        allAvailable,
        items: stockStatus
      }
    });
    
  } catch (error) {
    console.error('Stock check error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}