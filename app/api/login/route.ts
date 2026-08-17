import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
}
interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const [rows] = await db.query<UserRow[]>('SELECT id, email, password FROM admin WHERE email = ? LIMIT 1', [email]);

    if (!rows.length) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );
    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        userId: user.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
