import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const [minPriceProduct, maxPriceProduct] = await Promise.all([
      Product.findOne().sort({ price: 1 }).select('price'),
      Product.findOne().sort({ price: -1 }).select('price')
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        min: minPriceProduct?.price || 0,
        max: maxPriceProduct?.price || 1000
      }
    });
    
  } catch (error) {
    console.error('Price Range API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price range' },
      { status: 500 }
    );
  }
}