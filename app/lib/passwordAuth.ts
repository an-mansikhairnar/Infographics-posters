import bcrypt from 'bcrypt';
import type { User } from 'next-auth';
import type { RowDataPacket } from 'mysql2';
import { db } from '@/app/lib/db';

interface CreatorRow extends RowDataPacket {
  id: number;
  email: string;
  name: string | null;
  image: string | null;
  password_hash: string | null;
}

// export async function authenticateCreator(
//   credentials: Partial<Record<string, unknown>> | undefined
// ): Promise<User | null> {
//   if (!credentials) return null;
//   const email = typeof credentials.email === 'string' ? credentials.email.trim().toLowerCase() : '';
//   const password = typeof credentials.password === 'string' ? credentials.password : '';
//   const mode = credentials.mode === 'register' ? 'register' : 'login';
//   if (!email || !/^\S+@\S+\.\S+$/.test(email) || !password) return null;
//   if (mode === 'register' && password.length < 8) return null;

//   const [rows] = await db.query<CreatorRow[]>(
//     'SELECT id, email, name, image, password_hash FROM creator_users WHERE email = ? LIMIT 1',
//     [email]
//   );

//   if (mode === 'register') {
//     if (rows.length) return null;
//     const passwordHash = await bcrypt.hash(password, 12);
//     const [result] = await db.query(
//       'INSERT INTO creator_users (email, password_hash) VALUES (?, ?)',
//       [email, passwordHash]
//     );
//     const userId = Number((result as { insertId: number }).insertId);
//     return { id: String(userId), email, name: null, image: null };
//   }

//   const row = rows[0];
//   if (!row?.password_hash || !(await bcrypt.compare(password, row.password_hash))) return null;
//   return { id: String(row.id), email: row.email, name: row.name, image: row.image };
// }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 64;

function isValidNewPassword(password: string): boolean {
  return (
    password.length >= PASSWORD_MIN &&
    password.length <= PASSWORD_MAX &&
    Buffer.byteLength(password, 'utf8') <= 72 && // bcrypt only uses the first 72 bytes
    !/\s/.test(password) &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9\s]/.test(password)
  );
}

export async function authenticateCreator(
  credentials: Partial<Record<string, unknown>> | undefined
): Promise<User | null> {
  if (!credentials) return null;
  const firstName = typeof credentials.firstName === 'string' ? credentials.firstName.trim() : '';
  const lastName = typeof credentials.lastName === 'string' ? credentials.lastName.trim() : '';
  const email = typeof credentials.email === 'string' ? credentials.email.trim().toLowerCase() : '';
  const password = typeof credentials.password === 'string' ? credentials.password : '';
  const mode = credentials.mode === 'register' ? 'register' : 'login';

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return null;
  if (!password || !password.trim() || password.length > 128) return null;
  if (
    mode === 'register' &&
    (!firstName || firstName.length > 100 || !lastName || lastName.length > 100 || !isValidNewPassword(password))
  ) {
    return null;
  }

  const [rows] = await db.query<CreatorRow[]>(
    'SELECT id, email, name, image, password_hash FROM creator_users WHERE email = ? LIMIT 1',
    [email]
  );

  if (mode === 'register') {
    if (rows.length) return null;
    const passwordHash = await bcrypt.hash(password, 12);
    try {
      const [result] = await db.query(
        'INSERT INTO creator_users (email, password_hash, name) VALUES (?, ?, ?)',
        [email, passwordHash, `${firstName} ${lastName}`]
      );
      const userId = Number((result as { insertId: number }).insertId);
      return { id: String(userId), email, name: `${firstName} ${lastName}`, image: null };
    } catch (error) {
      // Two simultaneous registrations with the same email: the UNIQUE index rejects the second one
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') return null;
      throw error;
    }
  }

  const row = rows[0];
  if (!row?.password_hash || !(await bcrypt.compare(password, row.password_hash))) return null;
  return { id: String(row.id), email: row.email, name: row.name, image: row.image };
}