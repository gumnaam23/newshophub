import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Setting } from '@/models/Setting';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({
        storeName: 'ShopHub',
        storeEmail: 'info@shophub.com',
        currency: 'USD',
        taxRate: 10,
        freeShippingThreshold: 50
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const settings = await Setting.findOneAndUpdate(
      {},
      body,
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: settings, message: 'Settings updated' });
  } catch (error) {
    console.error('Settings Update Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}