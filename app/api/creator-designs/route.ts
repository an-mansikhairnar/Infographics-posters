import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import { db } from '@/app/lib/db';
import { getCreatorIdentity } from '@/app/lib/creatorAuth';

interface DesignRow extends RowDataPacket {
  design_json: string;
}

type SavedDesign = {
  id: string;
  name: string;
  width: number;
  height: number;
  bg: unknown;
  templateId: string | null;
  data: unknown;
  objects?: unknown[];
  thumb: string | null;
  createdAt: number;
  updatedAt: number;
};

export async function GET() {
  const creator = await getCreatorIdentity();
  if (!creator) return NextResponse.json({ message: 'Sign in to access your designs.' }, { status: 401 });

  try {
    const [rows] = await db.query<DesignRow[]>(
      'SELECT design_json FROM creator_designs WHERE owner_id = ? ORDER BY updated_at DESC',
      [creator.userId]
    );
    return NextResponse.json({ designs: rows.map((row) => JSON.parse(row.design_json)) });
  } catch (error) {
    console.error('Could not load creator designs:', error);
    return NextResponse.json({ message: 'Unable to load designs.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const creator = await getCreatorIdentity();
  if (!creator) return NextResponse.json({ message: 'Sign in to save designs.' }, { status: 401 });

  try {
    const design: unknown = await request.json();
    if (
      typeof design !== 'object' || design === null ||
      !('id' in design) || typeof design.id !== 'string' || !design.id || design.id.length > 64 ||
      !('name' in design) || typeof design.name !== 'string' || !design.name.trim() ||
      !('width' in design) || !Number.isFinite(design.width) ||
      !('height' in design) || !Number.isFinite(design.height) ||
      !('bg' in design) || typeof design.bg !== 'object' || design.bg === null
    ) {
      return NextResponse.json({ message: 'Invalid design data.' }, { status: 400 });
    }

    const input = design as Record<string, unknown>;
    const [existingRows] = await db.query<DesignRow[]>(
      'SELECT design_json FROM creator_designs WHERE owner_id = ? AND design_id = ? LIMIT 1',
      [creator.userId, input.id]
    );
    let createdAt = Date.now();
    if (existingRows.length) {
      const existing = JSON.parse(existingRows[0].design_json) as Partial<SavedDesign>;
      if (Number.isFinite(existing.createdAt)) createdAt = existing.createdAt!;
    } else if (Number.isFinite(input.createdAt)) {
      createdAt = input.createdAt as number;
    }
    const saved: SavedDesign = {
      id: input.id as string,
      name: (input.name as string).trim().slice(0, 160),
      width: input.width as number,
      height: input.height as number,
      bg: input.bg,
      templateId: typeof input.templateId === 'string' ? input.templateId : null,
      data: input.data ?? null,
      objects: Array.isArray(input.objects) ? input.objects : undefined,
      thumb: typeof input.thumb === 'string' ? input.thumb : null,
      createdAt,
      updatedAt: Date.now(),
    };
    await db.query(
      `INSERT INTO creator_designs (owner_id, design_id, design_json, updated_at)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE design_json = VALUES(design_json), updated_at = CURRENT_TIMESTAMP`,
      [creator.userId, saved.id, JSON.stringify(saved)]
    );
    return NextResponse.json({ design: saved });
  } catch (error) {
    console.error('Could not save creator design:', error);
    return NextResponse.json({ message: 'Unable to save design.' }, { status: 500 });
  }
}