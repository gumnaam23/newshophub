import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email })
      .populate('wishlist');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user.wishlist,
      count: user.wishlist.length
    });
    
  } catch (error) {
    console.error('Wishlist API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

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
    
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if already in wishlist
    if (user.wishlist.includes(productId)) {
      return NextResponse.json(
        { success: false, error: 'Product already in wishlist' },
        { status: 400 }
      );
    }
    
    user.wishlist.push(productId);
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Added to wishlist'
    });
    
  } catch (error) {
    console.error('Add to Wishlist Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    user.wishlist = user.wishlist.filter((id: string) => id.toString() !== productId);
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist'
    });
    
  } catch (error) {
    console.error('Remove from Wishlist Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}