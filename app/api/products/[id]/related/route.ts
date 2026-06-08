import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }>  }
) {
  try {
    await dbConnect();
    const params = await context.params

    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Find related products based on same category or brand
    const relatedProducts = await Product.find({
      _id: { $ne: params.id },
      $or: [
        { category: product.category },
        { brand: product.brand },
        { tags: { $in: product.tags } }
      ]
    })
    .limit(8)
    .lean();
    
    return NextResponse.json({
      success: true,
      data: relatedProducts
    });
    
  } catch (error) {
    console.error('Related Products Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch related products' },
      { status: 500 }
    );
  }
}