import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const [myInfo] = await db.query('SELECT * FROM my_infographic ORDER BY infoId DESC');
    return NextResponse.json(myInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}
