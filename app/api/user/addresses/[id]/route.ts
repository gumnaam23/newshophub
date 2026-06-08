import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { IAddress, User } from '@/models/User';
import { auth } from '@/lib/auth';
import { Types } from 'mongoose';


type AddressWithId = IAddress & {
  _id: Types.ObjectId;
};


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const params = await context.params

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const address = user.addresses.id(params.id);
    if (!address) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Fetch address error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch address' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const params = await context.params


    const { fullName, street, city, state, zipCode, country, phone, isDefault, type } = await request.json();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const address = user.addresses.id(params.id);
    if (!address) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    if (isDefault && !address.isDefault) {
      user.addresses.forEach((addr: AddressWithId) => {
        addr.isDefault = false;
      });
    }

    address.fullName = fullName;
    address.street = street;
    address.city = city;
    address.state = state;
    address.zipCode = zipCode;
    address.country = country;
    address.phone = phone;
    address.isDefault = isDefault;
    address.type = type;

    await user.save();

    return NextResponse.json({
      success: true,
      data: address,
      message: 'Address updated successfully'
    });
  } catch (error) {
    console.error('Update address error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const params = await context.params


    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    user.addresses = user.addresses.filter((addr: AddressWithId) => addr._id.toString() !== params.id);

    if (user.addresses.length > 0 && !user.addresses.some((addr: AddressWithId) => addr.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete address' }, { status: 500 });
  }
}