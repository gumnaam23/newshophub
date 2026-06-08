import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 2MB' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${session.user.id}_${timestamp}.${file.type.split('/')[1]}`;
    const filepath = path.join(uploadDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;

    // Update user in database
    await User.findOneAndUpdate(
      { email: session.user.email },
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      data: { avatar: avatarUrl },
      message: 'Avatar updated successfully'
    });

  } catch (error) {
    console.error('Avatar Upload Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}