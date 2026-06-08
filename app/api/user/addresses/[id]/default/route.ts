import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { IAddress, User } from '@/models/User';
import { auth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    const params = await context.params 

    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove default from all addresses
    user.addresses.forEach((addr: IAddress) => {
      addr.isDefault = false;
    });
    
    // Set new default
    const address = user.addresses.id(params.id);
    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }
    
    address.isDefault = true;
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Default address updated'
    });
    
  } catch (error) {
    console.error('Set default address error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set default address' },
      { status: 500 }
    );
  }
}