import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [articles] = await db.query('SELECT * FROM article');

    return NextResponse.json(articles);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}

