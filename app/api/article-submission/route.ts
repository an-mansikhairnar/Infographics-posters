import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate only the fields required by this submission form
    if (
      !body.title?.trim() ||
      !body.catId ||
      !body.email?.trim() ||
      !body.desc?.trim() ||
      !body.imgUrl?.trim()
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
      body.title.trim(),

      // Generate alias from title
      body.alias ||
        body.title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''),

      Number(body.catId),

      0,

      // Default article type for frontend submissions
      body.type || 'article',

      // Default status
      0,

      // Use description as intro description
      body.desc.trim(),

      // Use description as full description
      body.desc.trim(),

      '',

      // Image URL
      body.imgUrl.trim(),

      body.imgUrl.trim(),

      body.imageAltText || body.title.trim(),

      body.metaTitle || body.title.trim(),

      body.metaKey || '',

      body.metaDescription || body.desc.trim(),

      body.clientName || '',

      '',

      body.facebook || '',
      body.facebookUrl || '',

      body.instagram || '',
      body.instagramUrl || '',

      '',

      body.twitter || '',
      body.twitterUrl || '',

      '',

      0,
      0,

      new Date(),

      body.email.trim(),
    ];

    const [result] = await db.query(query, values);

    return NextResponse.json(
      {
        success: true,
        message: 'Article submitted successfully.',
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Article submission error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit article.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
