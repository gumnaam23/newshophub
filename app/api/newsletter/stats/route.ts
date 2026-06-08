import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Newsletter, NewsletterCampaign } from '@/models/Newsletter';
import { auth } from '@/lib/auth';

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
    
    const totalSubscribers = await Newsletter.countDocuments({ status: 'active' });
    const totalUnsubscribed = await Newsletter.countDocuments({ status: 'unsubscribed' });
    
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const newSubscribers = await Newsletter.countDocuments({
      subscribedAt: { $gte: last30Days },
      status: 'active'
    });
    
    const recentCampaigns = await NewsletterCampaign.find()
      .sort({ sentAt: -1 })
      .limit(10)
      .populate('sentBy', 'name email');
    
    return NextResponse.json({
      success: true,
      data: {
        totalSubscribers,
        totalUnsubscribed,
        newSubscribersLast30Days: newSubscribers,
        recentCampaigns
      }
    });
    
  } catch (error) {
    console.error('Newsletter stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}