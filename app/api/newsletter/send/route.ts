import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Newsletter, NewsletterCampaign } from '@/models/Newsletter';
import { auth } from '@/lib/auth';




async function sendNewsletterEmail(email: string, name: string, subject: string, content: string) {
  // Your email sending logic here
  // Example: await sendEmail({ to: email, subject, html: content });
  console.log(`Sending email to ${email}`);
  return true;
}

type INewsletterQuery = {
  status: string;
  subscribedAt?: { $gte: Date };
  lastEmailSent?: { $lt: Date };
  'preferences.promotions'?: boolean;
  'preferences.newArrivals'?: boolean;
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { subject, content, type, segment } = await request.json();
    
    if (!subject || !content) {
      return NextResponse.json(
        { success: false, error: 'Subject and content are required' },
        { status: 400 }
      );
    }
    
    // Build query based on segment
    const query: INewsletterQuery = { status: 'active' };
    
    if (segment && segment !== 'all') {
      switch (segment) {
        case 'active_last_30':
          query.subscribedAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
          break;
        case 'inactive':
          query.lastEmailSent = { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
          break;
        case 'prefers_promotions':
          query['preferences.promotions'] = true;
          break;
        case 'prefers_new_arrivals':
          query['preferences.newArrivals'] = true;
          break;
      }
    }
    
    const subscribers = await Newsletter.find(query);
    
    if (subscribers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No subscribers found' },
        { status: 404 }
      );
    }
    
    // Send emails in batches to avoid overwhelming
    const batchSize = 50;
    const results = [];
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const emailPromises = batch.map(subscriber =>
        sendNewsletterEmail(subscriber.email, subscriber.name, subject, content)
      );
      
      const batchResults = await Promise.allSettled(emailPromises);
      results.push(...batchResults);
      
      // Update last email sent timestamp
      await Newsletter.updateMany(
        { _id: { $in: batch.map(s => s._id) } },
        { lastEmailSent: new Date() }
      );
      
      // Add delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    // Log campaign
    await NewsletterCampaign.create({
      subject,
      type,
      segment: segment || 'all',
      recipientsCount: subscribers.length,
      successfulCount: successful,
      failedCount: failed,
      sentAt: new Date(),
      sentBy: session.user.id
    });
    
    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${successful} subscribers`,
      data: {
        total: subscribers.length,
        successful,
        failed
      }
    });
    
  } catch (error) {
    console.error('Send newsletter error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}