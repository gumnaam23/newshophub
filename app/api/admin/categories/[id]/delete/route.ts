import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { auth } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params:Promise< { id: string }> }
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
    const { id } = await params

    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category.name });
    
    if (productCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category with ${productCount} products. Please reassign or delete products first.` 
        },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete Category API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}