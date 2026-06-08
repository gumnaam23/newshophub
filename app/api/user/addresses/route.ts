import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { IAddress, User } from '@/models/User';
import { auth } from '@/lib/auth';
import { Types } from 'mongoose';


type AddressWithId = IAddress & {
  _id: Types.ObjectId;
};

// GET - Fetch all addresses
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: user.addresses || []
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new address
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { fullName, street, city, state, zipCode, country, phone, isDefault } = await request.json();

    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    // If this is default, remove default from other addresses
    if (isDefault) {
      user.addresses.forEach((addr: AddressWithId) => {
        addr.isDefault = false;
      });
    }


    const newAddress = {
       _id: new Types.ObjectId().toString(),
      fullName,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault: isDefault || user.addresses.length === 0
    };

    user.addresses.push(newAddress);
    await user.save();
    
    return NextResponse.json({
      success: true,
      data: newAddress,
      message: 'Address added successfully'
    });
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}