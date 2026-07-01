// // app/api/articles/[id]/route.ts

// import { db } from '@/app/lib/db';
// import { NextResponse } from 'next/server';

// export async function GET({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;

//   const [rows] = await db.query('SELECT * FROM article WHERE articleId = ?', [id]);

//   return NextResponse.json(rows);
// }
import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { Article } from '@/app/interfaces/infographics';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [rows] = await db.query(
    'SELECT * FROM article WHERE articleId = ?',
    [id]
  );

  const articles = rows as Article[];

  if (!articles.length) {
    return NextResponse.json(
      { message: 'Article not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(articles[0]);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [result] = await db.query(
    'UPDATE article SET hits = hits + 1 WHERE articleId = ?',
    [id]
  );

  const updateResult = result as { affectedRows: number };

  if (!updateResult.affectedRows) {
    return NextResponse.json(
      { message: 'Article not found' },
      { status: 404 }
    );
  }

  const [rows] = await db.query(
    'SELECT hits FROM article WHERE articleId = ?',
    [id]
  );

  const articles = rows as { hits: number }[];

  return NextResponse.json({ hits: articles[0].hits });
}