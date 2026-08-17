import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const FULL_IMG_DIR = path.join(process.cwd(), 'public', 'images', 'stories', 'infographics');
const THUMB_IMG_DIR = path.join(process.cwd(), 'public', 'images', 'stories', 'infographics-thumb');

async function ensureDirAndSave(baseDir: string, folder: string, file: File) {
  const targetDir = path.join(baseDir, folder);

  // Creates the folder if missing; if it already exists this just resolves, no error.
  await fs.mkdir(targetDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(targetDir, file.name);
  await fs.writeFile(filePath, buffer);

  return filePath;
}

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();

//     const imgFolder = formData.get('imgFolder') as string | null;
//     const fullImageFile = formData.get('fullImageFile') as File | null;
//     const thumbImageFile = formData.get('thumbImageFile') as File | null;

//     if (!imgFolder) {
//       return NextResponse.json({ error: 'imgFolder is required' }, { status: 400 });
//     }

//     const result: { fullImagePath?: string; thumbImagePath?: string } = {};

//     if (fullImageFile) {
//       result.fullImagePath = await ensureDirAndSave(FULL_IMG_DIR, imgFolder, fullImageFile);
//     }
//     if (thumbImageFile) {
//       result.thumbImagePath = await ensureDirAndSave(THUMB_IMG_DIR, imgFolder, thumbImageFile);
//     }

//     return NextResponse.json({ success: true, ...result });
//   } catch (err) {
//     console.error('Upload error:', err);
//     return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
//   }
// }
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const imgFolder = formData.get('imgFolder') as string | null;
    const fullImageFile = formData.get('fullImageFile') as File | null;
    const thumbImageFile = formData.get('thumbImageFile') as File | null;

    if (!imgFolder) {
      return NextResponse.json(
        { error: 'imgFolder is required' },
        { status: 400 }
      );
    }

    let fullImageUrl = '';
    let thumbImageUrl = '';

    if (fullImageFile) {
      await ensureDirAndSave(FULL_IMG_DIR, imgFolder, fullImageFile);

      fullImageUrl = `/images/stories/infographics/${imgFolder}/${fullImageFile.name}`;
    }

    if (thumbImageFile) {
      await ensureDirAndSave(THUMB_IMG_DIR, imgFolder, thumbImageFile);

      thumbImageUrl = `/images/stories/infographics-thumb/${imgFolder}/${thumbImageFile.name}`;
    }

    return NextResponse.json({
      success: true,
      fullImageUrl,
      thumbImageUrl,
    });
  } catch (err) {
    console.error('Upload error:', err);

    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}