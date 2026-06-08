import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';

// Type for CSV product data
interface CsvProduct {
  name?: string;
  price?: string;
  compareprice?: string;
  stock?: string;
  category?: string;
  brand?: string;
  description?: string;
  [key: string]: string | undefined;
}

// Type for processed product
interface ProcessedProduct {
  name: string;
  slug: string;
  price: number;
  comparePrice: number;
  stock: number;
  category?: string;
  brand?: string;
  description?: string;
  [key: string]: string | number | undefined;
}

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const rows = text.split('\n');
    const headers = rows[0].split(',');
    
    const products: ProcessedProduct[] = [];
    const errors: string[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue;
      
      const values = rows[i].split(',');
      const product: CsvProduct = {};
      
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j].trim().toLowerCase();
        product[header] = values[j]?.trim();
      }
      
      // Validate required fields
      if (!product.name || !product.price) {
        errors.push(`Row ${i + 1}: Missing name or price`);
        continue;
      }
      
      // Generate slug
      const slug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      const processedProduct: ProcessedProduct = {
        name: product.name,
        slug: slug,
        price: parseFloat(product.price),
        comparePrice: product.compareprice ? parseFloat(product.compareprice) : 0,
        stock: parseInt(product.stock || '0') || 0,
      };
      
      // Add optional fields if they exist
      if (product.category) processedProduct.category = product.category;
      if (product.brand) processedProduct.brand = product.brand;
      if (product.description) processedProduct.description = product.description;
      
      products.push(processedProduct);
    }
    
    // Bulk insert
    let inserted = 0;
    for (const product of products) {
      try {
        await Product.create(product);
        inserted++;
      } catch (error) {
        errors.push(`Failed to import ${product.name}: ${error}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        imported: inserted,
        failed: products.length - inserted,
        errors
      },
      message: `Imported ${inserted} products successfully`
    });

  } catch (error) {
    console.error('Import Products Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import products' },
      { status: 500 }
    );
  }
}