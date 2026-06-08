import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params

    const categoryName = decodeURIComponent(slug);

    const products = await Product.find({ category: categoryName })
      .limit(1)
      .lean();

    if (products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const productCount = await Product.countDocuments({ category: categoryName });

    const category = {
      name: categoryName,
      slug: categoryName,
      description: products[0]?.description || `Shop the best ${categoryName} products`,
      image: products[0]?.images[0] || '/api/placeholder/400/300',
      productCount
    };

    return NextResponse.json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('Category Slug Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}