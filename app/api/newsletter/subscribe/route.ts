import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Newsletter } from '@/models/Newsletter';
import { sendWelcomeEmail, sendNewsletterEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, name, preferences } = await request.json();
    
    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if already subscribed
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { success: false, error: 'Email already subscribed' },
          { status: 400 }
        );
      } else if (existingSubscriber.status === 'unsubscribed') {
        // Reactivate subscription
        existingSubscriber.status = 'active';
        existingSubscriber.unsubscribedAt = undefined;
        await existingSubscriber.save();
        
        return NextResponse.json({
          success: true,
          message: 'Subscription reactivated successfully',
          data: existingSubscriber
        });
      }
    }
    
    // Create new subscriber
    const subscriber = await Newsletter.create({
      email,
      name: name || '',
      preferences: preferences || {
        promotions: true,
        newArrivals: true,
        deals: true,
        weeklyDigest: false
      },
      subscribedAt: new Date(),
      status: 'active',
      source: 'homepage_newsletter'
    });
    
    // Send welcome email (optional - implement if you have email service)
    // try {
    //   await sendWelcomeEmail(email, name);
    // } catch (emailError) {
    //   console.error('Failed to send welcome email:', emailError);
    //   // Don't fail the request if email fails
    // }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        id: subscriber._id,
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt
      }
    });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    // Soft delete - just mark as unsubscribed
    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();
    
    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
    
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}