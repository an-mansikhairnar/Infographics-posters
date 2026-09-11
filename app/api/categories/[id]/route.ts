import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM category WHERE catId = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { title, alias, status, metaTitle, metaKey, metaDescription } = body;

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE category
       SET title = ?, alias = ?, status = ?, metaTitle = ?, metaKey = ?, metaDescription = ?
       WHERE catId = ?`,
      [title, alias, status, metaTitle, metaKey, metaDescription, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category updated successfully' });
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
      UPDATE category
      SET
        title = ?,
        alias = ?,
        status = ?,
        metaTitle = ?,
        metaKey = ?,
        metaDescription = ?
      WHERE catId = ?
    `;

    const values = [body.title, body.alias, body.status, body.metaTitle, body.metaKey, body.metaDescription, id];

    const [result] = await db.query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update category',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [result] = await db.query<ResultSetHeader>('DELETE FROM category WHERE catId = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}
