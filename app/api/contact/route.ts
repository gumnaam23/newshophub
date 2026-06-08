import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email-service';
import ContactMessage from '@/models/ContactMessage';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, orderNumber } = await request.json();
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    // Save to database (optional)
    await ContactMessage.create({ name, email, subject, message, orderNumber });
    
    // Send email notification
    await sendContactEmail(name, email, subject, message, orderNumber);
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}