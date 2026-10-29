import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'A PNG image is required.' }, { status: 400 });
    }

    if (file.type !== 'image/png') {
      return NextResponse.json({ error: 'Only PNG images are supported.' }, { status: 415 });
    }

    if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'The PNG image must be 20 MB or smaller.' },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
      return NextResponse.json({ error: 'The uploaded file is not a valid PNG image.' }, { status: 400 });
    }

    const filename = `${randomUUID()}.png`;
    const uploadDir = path.join(process.cwd(), 'public/uploads/infographics');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicImageUrl = `/uploads/infographics/${filename}`;
    return NextResponse.json({ success: true, imageUrl: publicImageUrl });
  } catch (error) {
    console.error('Infographic image upload error:', error);
    return NextResponse.json({ error: 'Failed to upload infographic image.' }, { status: 500 });
  }
}