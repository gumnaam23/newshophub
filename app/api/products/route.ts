import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { auth } from '@/lib/auth';

interface ProductQuery {
  category?: string | { $in: string[] };
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  price?: {
    $gte?: number;
    $lte?: number;
  };
  rating?: { $gte: number };
  brand?: { $in: string[] };
  sizes?: { $in: string[] };
  colors?: { $in: string[] };
  stock?: { $gt: number };
  comparePrice?: { $gt: number };
  $expr?: { $gt: string[] };
  isNewProduct?: boolean;
  isFeatured?: boolean;
}



export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'newest';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const brands = searchParams.get('brands')?.split(',');
    const categories = searchParams.get('categories')?.split(',');
    const sizes = searchParams.get('sizes')?.split(',');
    const colors = searchParams.get('colors')?.split(',');
    const inStock = searchParams.get('inStock') === 'true';
    const onSale = searchParams.get('onSale') === 'true';
    const isNew = searchParams.get('isNew') === 'true';
    const isFeatured = searchParams.get('isFeatured') === 'true';
    const rating = searchParams.get('rating');
    
    // Build query
    const query: ProductQuery = {};
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    if (categories && categories.length > 0) {
      query.category = { $in: categories };
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }
    
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    // Brand filter
    if (brands && brands.length > 0) {
      query.brand = { $in: brands };
    }
    
    // Size filter
    if (sizes && sizes.length > 0) {
      query.sizes = { $in: sizes };
    }
    
    // Color filter
    if (colors && colors.length > 0) {
      query.colors = { $in: colors };
    }
    
    // Stock filter
    if (inStock) {
      query.stock = { $gt: 0 };
    }
    
    // Sale filter
    if (onSale) {
      query.comparePrice = { $gt: 0 };
      query.$expr = { $gt: ["$comparePrice", "$price"] };
    }
    
    // New arrivals
    if (isNew) {
        query.isNewProduct = true;

    }
    
    // Featured products
    if (isFeatured) {
      query.isFeatured = true;
    }
    
    // Build sort
let sortOption: Record<string, 1 | -1> = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'price_low':
        sortOption = { price: 1 };
        break;
      case 'price_high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'popularity':
        sortOption = { reviewCount: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Execute queries
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);
    
    // Get unique brands for filters (for the response)
    const uniqueBrands = await Product.distinct('brand', query);
    
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
        brands: uniqueBrands,
        totalProducts: total
      }
    });
    
  } catch (error) {
    console.error('Products API Error:', error);
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
    
    const product = await Product.create(body);
    
    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
    
  } catch (error) {
    console.error('Create Product Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}