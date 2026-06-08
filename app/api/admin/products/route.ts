import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';

interface ProductQuery {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  category?: string;
  price?: {
    $gte?: number;
    $lte?: number;
  };
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || '-createdAt';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const query: ProductQuery = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (status === 'active') {
      query.stock = { $gt: 0 };
    } else if (status === 'low-stock') {
      query.stock = { $gt: 0, $lt: 10 };
    } else if (status === 'out-of-stock') {
      query.stock = 0;
    }

        const skip = (page - 1) * limit;


    
    // Build sort object
    let sortObject: Record<string, 1 | -1> = {};
    switch (sortBy) {
      case 'name_asc':
        sortObject = { name: 1 };
        break;
      case 'name_desc':
        sortObject = { name: -1 };
        break;
      case 'price_asc':
        sortObject = { price: 1 };
        break;
      case 'price_desc':
        sortObject = { price: -1 };
        break;
      case 'stock_asc':
        sortObject = { stock: 1 };
        break;
      case 'stock_desc':
        sortObject = { stock: -1 };
        break;
      case 'created_asc':
        sortObject = { createdAt: 1 };
        break;
      default:
        sortObject = { createdAt: -1 };
    }
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    // Get unique categories for filter
    const categories = await Product.distinct('category');

    // Get price range for filter
    const priceRange = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        categories,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 }
      }
    });

  } catch (error) {
    console.error('Admin Products API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
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

    const body = await request.json();
    
    // Validation
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }
    
    if (body.price < 0) {
      return NextResponse.json(
        { success: false, error: 'Price cannot be negative' },
        { status: 400 }
      );
    }
    
    if (body.stock < 0) {
      return NextResponse.json(
        { success: false, error: 'Stock cannot be negative' },
        { status: 400 }
      );
    }
    
    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'A product with similar name already exists' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      ...body,
      slug,
      price: parseFloat(body.price),
      comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : 0,
      stock: parseInt(body.stock),
      rating: 0,
      reviewCount: 0,
      soldCount: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Admin Create Product API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const product = await Product.findByIdAndUpdate(
      id,
      { 
        ...body,
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Admin Update Product API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Admin Delete Product API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}