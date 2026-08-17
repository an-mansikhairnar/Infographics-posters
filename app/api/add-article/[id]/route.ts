import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [result] = await db.query<ResultSetHeader>('DELETE FROM article WHERE articleId = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Article deleted successfully',
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const query = `
      UPDATE article
      SET
        title = ?,
        alias = ?,
        catId = ?,
        featured = ?,
        type = ?,
        status = ?,
        introDescription = ?,
        fullDescription = ?,
        imgFolder = ?,
        fullImageUrl = ?,
        thumbImageUrl = ?,
        imageAltText = ?,
        metaTitle = ?,
        metaKey = ?,
        metaDescription = ?,
        author = ?,
        authorUrl = ?,
        facebook = ?,
        facebookUrl = ?,
        instagram = ?,
        instagramUrl = ?,
        imgPrefix = ?,
        twitter = ?,
        twitterUrl = ?,
        embedCode = ?,
        authorEmail = ?
      WHERE articleId = ?
    `;

    const values = [
      body.title,
      body.alias,
      body.catId,
      body.featured,
      body.type,
      body.status === 'Yes' ? 1 : 0,
      body.introDescription,
      body.fullDescription,
      body.imgFolder,
      body.fullImageUrl,
      body.thumbImageUrl,
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
      body.authorEmail ?? '',
      id,
    ];
    const [result] = await db.query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update article',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM article WHERE articleId = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}
