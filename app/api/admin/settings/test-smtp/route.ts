import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { host, port, user, pass, fromEmail } = await request.json();

    if (!host || !port || !user || !pass || !fromEmail) {
      return NextResponse.json(
        { success: false, error: 'All SMTP fields are required' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: port === '465',
      auth: { user, pass }
    });

    // Verify connection
    await transporter.verify();

    // Send test email
    await transporter.sendMail({
      from: `"Test" <${fromEmail}>`,
      to: session.user.email,
      subject: 'SMTP Configuration Test',
      html: `
        <h2>SMTP Configuration Test</h2>
        <p>This is a test email to verify that your SMTP settings are working correctly.</p>
        <p>If you received this email, your SMTP configuration is correct!</p>
        <br>
        <p>Best regards,<br>ShopHub Team</p>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'SMTP connection successful and test email sent'
    });

  } catch (error) {
    console.error('SMTP Test Error:', error);
    return NextResponse.json(
      { success: false, error: 'SMTP connection failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}