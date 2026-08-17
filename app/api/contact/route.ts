import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const [clientInfo] = await db.query('SELECT * FROM client_infographics ORDER BY id DESC');
    return NextResponse.json(clientInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}
