import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import { db } from '@/app/lib/db';
import { getCreatorIdentity } from '@/app/lib/creatorAuth';

interface DesignRow extends RowDataPacket {
  design_json: string;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const creator = await getCreatorIdentity();
  if (!creator) return NextResponse.json({ message: 'Sign in to access your designs.' }, { status: 401 });
  const { id } = await params;

  try {
    const [rows] = await db.query<DesignRow[]>(
      'SELECT design_json FROM creator_designs WHERE owner_id = ? AND design_id = ? LIMIT 1',
      [creator.userId, id]
    );
    if (!rows.length) return NextResponse.json({ message: 'Design not found.' }, { status: 404 });
    return NextResponse.json({ design: JSON.parse(rows[0].design_json) });
  } catch (error) {
    console.error('Could not load creator design:', error);
    return NextResponse.json({ message: 'Unable to load design.' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const creator = await getCreatorIdentity();
  if (!creator) return NextResponse.json({ message: 'Sign in to delete designs.' }, { status: 401 });
  const { id } = await params;

  try {
    const [result] = await db.query(
      'DELETE FROM creator_designs WHERE owner_id = ? AND design_id = ?',
      [creator.userId, id]
    );
    return NextResponse.json({ deleted: true, affectedRows: (result as { affectedRows: number }).affectedRows });
  } catch (error) {
    console.error('Could not delete creator design:', error);
    return NextResponse.json({ message: 'Unable to delete design.' }, { status: 500 });
  }
}