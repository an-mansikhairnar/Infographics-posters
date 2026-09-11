import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { ResultSetHeader } from 'mysql2';
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const [result] = await db.query<ResultSetHeader>('DELETE FROM client_infographics WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Infographics not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
}
