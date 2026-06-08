'use server';

import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Welcome email template
export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ShopHub</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to ShopHub!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name || 'there'}!</h2>
            <p>Thank you for joining ShopHub! We're thrilled to have you as part of our community.</p>
            <p>With your new account, you can:</p>
            <ul>
              <li>🛍️ Shop from thousands of premium products</li>
              <li>📦 Track your orders in real-time</li>
              <li>❤️ Save items to your wishlist</li>
              <li>⭐ Earn points on every purchase</li>
            </ul>
            <p>To get started, explore our latest collections and enjoy exclusive member-only deals!</p>
            <a href="${process.env.NEXTAUTH_URL}/products" class="button">Start Shopping</a>
            <p>If you have any questions, our support team is here 24/7 to help you.</p>
            <p>Happy Shopping!<br>The ShopHub Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
            <p>123 Commerce Street, New York, NY 10001</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"ShopHub" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to ShopHub! 🎉',
      html,
    });

    return true;
  } catch (error) {
    console.error('Welcome email error:', error);
    return false;
  }
}

// Password reset email template
export async function sendPasswordResetEmail(email: string, name: string, resetUrl: string) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .warning { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>We received a request to reset your password for your ShopHub account.</p>
            <p>Click the button below to create a new password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <div class="warning">
              <strong>⚠️ This link will expire in 1 hour</strong><br>
              If you didn't request this, please ignore this email or contact support.
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #666;">${resetUrl}</p>
            <p>For security reasons, never share this link with anyone.</p>
            <p>Best regards,<br>The ShopHub Security Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"ShopHub Security" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Reset Your ShopHub Password',
      html,
    });

    return true;
  } catch (error) {
    console.error('Password reset email error:', error);
    return false;
  }
}

// Order confirmation email template
export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
) {
  try {
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .order-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { text-align: left; padding: 10px; background: #f1f5f9; }
          .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Thank you for your order, ${name}!</h2>
            <p>We've received your order and it's being processed.</p>
            
            <div class="order-details">
              <p><strong>Order Number:</strong> #${orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <h3>Order Summary</h3>
            <table>
              <thead>
                <tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div class="total">
              <p>Total: <strong>$${total.toFixed(2)}</strong></p>
            </div>
            
            <p>You can track your order status from your account dashboard.</p>
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/account/orders" class="button">Track Your Order</a>
            </div>
            <p>We'll send you another email when your order ships.</p>
            <p>Thank you for shopping with us!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"ShopHub" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: `Order Confirmation #${orderNumber}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return false;
  }
}

// Order shipped email template
export async function sendOrderShippedEmail(
  email: string,
  name: string,
  orderNumber: string,
  trackingNumber: string,
  carrier: string,
  trackingUrl: string
) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Shipped</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .tracking-info { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 Your Order Has Shipped!</h1>
          </div>
          <div class="content">
            <h2>Great news, ${name}!</h2>
            <p>Your order #${orderNumber} is on its way to you.</p>
            
            <div class="tracking-info">
              <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
              <p><strong>Carrier:</strong> ${carrier}</p>
              <div style="text-align: center;">
                <a href="${trackingUrl}" class="button">Track Your Package</a>
              </div>
            </div>
            
            <p>Estimated delivery: 2-5 business days depending on your location.</p>
            <p>If you have any questions about your delivery, please contact our support team.</p>
            <p>Thank you for shopping with ShopHub!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"ShopHub" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: `Your Order #${orderNumber} Has Shipped!`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Order shipped email error:', error);
    return false;
  }
}

// Contact form email template
export async function sendContactEmail(
  name: string,
  email: string,
  subject: string,
  message: string,
  orderNumber?: string
) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .message-box { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Contact Form Message</h1>
          </div>
          <div class="content">
            <p><strong>From:</strong> ${name} (${email})</p>
            ${orderNumber ? `<p><strong>Order Number:</strong> ${orderNumber}</p>` : ''}
            <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
            
            <div class="message-box">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <p>Reply directly to this email to respond to the customer.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to admin/support email
    await transporter.sendMail({
      from: `"ShopHub Contact" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SUPPORT_EMAIL || process.env.SMTP_FROM_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject || 'New message from ' + name}`,
      html,
    });

    // Send auto-reply to customer
    await transporter.sendMail({
      from: `"ShopHub Support" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'We received your message!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Thank you for contacting us</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You!</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for contacting ShopHub support. We have received your message and will get back to you within 24 hours.</p>
              <p>Here's a copy of your message for reference:</p>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
                <p><strong>Message:</strong> ${message}</p>
              </div>
              <p>If you have any additional information to add, please reply to this email.</p>
              <p>Best regards,<br>The ShopHub Support Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    console.error('Contact email error:', error);
    return false;
  }
}

// Newsletter email template
export async function sendNewsletterEmail(email: string, name: string, subject: string, content: string) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .unsubscribe { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ShopHub Newsletter</h1>
          </div>
          <div class="content">
            <h2>Hello ${name || 'there'}!</h2>
            ${content}
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/products" class="button">Shop Now</a>
            </div>
            <div class="unsubscribe">
              <p>You're receiving this because you subscribed to our newsletter.</p>
              <p><a href="${process.env.NEXTAUTH_URL}/api/newsletter/unsubscribe?email=${email}">Unsubscribe</a></p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"ShopHub Newsletter" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: subject,
      html,
    });

    return true;
  } catch (error) {
    console.error('Newsletter email error:', error);
    return false;
  }
}

// Bulk newsletter email sender
export async function sendBulkNewsletter(recipients: string[], subject: string, content: string) {
  try {
    const results = [];
    const batchSize = 50;
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const batchPromises = batch.map(email => sendNewsletterEmail(email, '', subject, content));
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
      
      // Delay between batches to avoid rate limiting
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    return { successful, failed, total: recipients.length };
  } catch (error) {
    console.error('Bulk newsletter error:', error);
    return { successful: 0, failed: recipients.length, total: recipients.length };
  }
}

// Test email configuration
export async function testEmailConfig() {
  try {
    await transporter.verify();
    return { success: true, message: 'Email configuration is working' };
  } catch (error) {
    console.error('Email config test failed:', error);
    return { success: false, message: 'Email configuration failed' };
  }
}