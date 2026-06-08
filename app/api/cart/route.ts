import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ICartItem, User } from '@/models/User';
import { IProduct, Product } from '@/models/Product';
import { auth } from '@/lib/auth';
import { Types } from 'mongoose';

// GET - Fetch user's cart
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
      .populate('cart.productId');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate cart totals
    type PopulatedCartItem = Omit<ICartItem, 'productId'> & {
      productId: IProduct;
      _id: Types.ObjectId;
    };
    let subtotal = 0;
    const cartItems = user.cart.map((item: PopulatedCartItem) => {
      const product = item.productId;
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      return {
        id: item._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images[0],
        total: itemTotal,
        stock: product.stock
      };
    });

    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        summary: {
          subtotal,
          shipping,
          tax,
          total,
          itemCount: user.cart.length,
          totalQuantity: user.cart.reduce((sum: number, item: ICartItem) => sum + item.quantity, 0)
        }
      }
    });

  } catch (error) {
    console.error('Fetch cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
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

    const { productId, quantity, size, color } = await request.json();

    // Validation
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: `Only ${product.stock} items available` },
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

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(
      (item: ICartItem) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;

      if (product.stock < newQuantity) {
        return NextResponse.json(
          { success: false, error: `Only ${product.stock} items available` },
          { status: 400 }
        );
      }

      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      user.cart.push({
        productId,
        quantity,
        size: size || null,
        color: color || null,
        addedAt: new Date()
      });
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        productId,
        quantity,
        size,
        color,
        cartCount: user.cart.length
      }
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { cartItemId, quantity } = await request.json();

    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Valid quantity is required' },
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

    const cartItem = user.cart.id(cartItemId);
    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Check stock
    const product = await Product.findById(cartItem.productId);
    if (product && product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: `Only ${product.stock} items available` },
        { status: 400 }
      );
    }

    cartItem.quantity = quantity;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully',
      data: { cartItemId, quantity }
    });

  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
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
    const cartItemId = searchParams.get('cartItemId');

    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: 'Cart item ID is required' },
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

    user.cart = user.cart.filter((item: ICartItem) => {
      // Type assertion since Mongoose documents have _id
      const itemDoc = item as ICartItem;
      return itemDoc._id?.toString() !== cartItemId;
    });
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      data: { cartItemId }
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}