import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const UUID_PNG_FILENAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.png$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!UUID_PNG_FILENAME.test(filename)) {
    return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
  }

  const imagePath = path.join(
    process.cwd(),
    'public/uploads/infographics',
    filename
  );

  try {
    const image = await readFile(imagePath);
    return new Response(image, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(image.byteLength),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
    }

    console.error('Infographic image download error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve infographic image.' },
      { status: 500 }
    );
  }
}
