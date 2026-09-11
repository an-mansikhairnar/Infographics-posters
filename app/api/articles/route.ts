import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (
      !body.title ||
      !body.alias ||
      !body.catId ||
      !body.type ||
      !body.introDescription ||
      !body.fullDescription
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please fill all mandatory fields.',
        },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO article (
        title,
        alias,
        catId,
        featured,
        type,
        status,
        introDescription,
        fullDescription,
        imgFolder,
        fullImageUrl,
        thumbImageUrl,
        imageAltText,
        metaTitle,
        metaKey,
        metaDescription,
        author,
        authorUrl,
        facebook,
        facebookUrl,
        instagram,
        instagramUrl,
        imgPrefix,
        twitter,
        twitterUrl,
        embedCode,
        hits,
        rating,
        created,
        authorEmail
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;

    const values = [
      body.title,
      body.alias,
      body.catId,
      body.featured === 'Yes' ? 1 : 0,
      body.type,
      body.status === 'Yes' ? 1 : 0,
      body.introDescription,
      body.fullDescription,
      body.imgFolder,
      body.fullImageUrl ?? '',
      body.thumbImageUrl ?? '',
      body.imageAltText,
      body.metaTitle,
      body.metaKey,
      body.metaDescription,
      body.author,
      body.authorUrl,
      body.facebook,
      body.facebookUrl,
      body.instagram,
      body.instagramUrl,
      body.imgPrefix ?? '',
      body.twitter,
      body.twitterUrl,
      body.embedCode,
      0,
      0,
      new Date(),
      body.authorEmail ?? '',
    ];

    const [result] = await db.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'Article saved successfully',
      data: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to save article',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [articles] = await db.query(
      'SELECT * FROM article ORDER BY created DESC'
    );

    return NextResponse.json(articles);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Database Error' },
      { status: 500 }
    );
  }
}
