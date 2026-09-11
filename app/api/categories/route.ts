import { db } from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const [category] = await db.query('SELECT * FROM category ORDER BY catId DESC');
    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { title, alias, status, metaTitle, metaKey, metaDescription } = body;

    const query = `
  INSERT INTO category
  (title, alias, status, metaTitle, metaKey, metaDescription, created)
  VALUES (?, ?, ?, ?, ?, ?, NOW())
`;

    const values = [title, alias, status, metaTitle, metaKey, metaDescription];

    await db.query(query, values);
    return NextResponse.json({ success: true, message: 'Category added successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false, message: 'Failed to add category' }, { status: 500 });
  }
}
