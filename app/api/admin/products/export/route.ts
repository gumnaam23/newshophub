import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';

interface ProductQuery {
  category?: string;
  stock?: { $gt: number } | { $gt: number; $lt: number } | number;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv';
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const query: ProductQuery = {};
    if (category && category !== 'all') query.category = category;
    if (status === 'active') query.stock = { $gt: 0 };
    if (status === 'low-stock') query.stock = { $gt: 0, $lt: 10 };
    if (status === 'out-of-stock') query.stock = 0;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .lean();

    if (format === 'csv') {
      // Create CSV
      const headers = ['ID', 'Name', 'Price', 'Compare Price', 'Stock', 'Category', 'Brand', 'Rating', 'Sold', 'Created At'];
      const csvRows = [headers];
      
      for (const product of products) {
        csvRows.push([
          product._id,
          product.name,
          product.price,
          product.comparePrice || '',
          product.stock,
          product.category,
          product.brand || '',
          product.rating || 0,
          product.soldCount || 0,
          new Date(product.createdAt).toISOString()
        ]);
      }
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=products-export-${new Date().toISOString()}.csv`
        }
      });
    } else {
      // JSON format
      return NextResponse.json({
        success: true,
        data: products,
        count: products.length,
        exportedAt: new Date()
      });
    }

  } catch (error) {
    console.error('Export Products Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export products' },
      { status: 500 }
    );
  }
}