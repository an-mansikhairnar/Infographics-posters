import type { Adapter, AdapterAccount, AdapterUser } from 'next-auth/adapters';
import type { RowDataPacket } from 'mysql2';
import { db } from '@/app/lib/db';

interface CreatorRow extends RowDataPacket {
  id: number;
  email: string | null;
  email_verified: Date | null;
  name: string | null;
  image: string | null;
}

interface InstagramUsernameRow extends RowDataPacket {
  instagram_username: string | null;
}

interface InstagramIdentityRow extends RowDataPacket {
  id: number;
}

async function getUserById(id: string): Promise<AdapterUser | null> {
  const [rows] = await db.query<CreatorRow[]>(
    'SELECT id, email, email_verified, name, image FROM creator_users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] ? toUser(rows[0]) : null;
}

function toUser(row: CreatorRow): AdapterUser {
  return {
    id: String(row.id),
    email: row.email ?? `instagram-user-${row.id}@users.invalid`,
    emailVerified: row.email_verified,
    name: row.name,
    image: row.image,
  };
}

const supportedProviders = new Set(['google', 'facebook', 'instagram']);

export async function updateInstagramUsername(
  userId: string,
  providerUserId: string,
  username: string
): Promise<void> {
  const [rows] = await db.query<InstagramIdentityRow[]>(
    `SELECT u.id
     FROM creator_users u
     JOIN creator_identities i ON i.owner_id = u.id
     WHERE u.id = ? AND i.provider = 'instagram' AND i.provider_user_id = ?
     LIMIT 1`,
    [userId, providerUserId]
  );
  if (!rows.length) {
    throw new Error('Cannot update Instagram username for an unlinked account.');
  }
  await db.query(
    'UPDATE creator_users SET instagram_username = ? WHERE id = ?',
    [username, userId]
  );
}

export async function getInstagramUsername(userId: string): Promise<string | null> {
  const [rows] = await db.query<InstagramUsernameRow[]>(
    'SELECT instagram_username FROM creator_users WHERE id = ? LIMIT 1',
    [userId]
  );
  return rows[0]?.instagram_username ?? null;
}

export const authAdapter: Adapter = {
  async createUser(data) {
    const [result] = await db.query(
      `INSERT INTO creator_users (email, password_hash, email_verified, name, image)
       VALUES (?, NULL, ?, ?, ?)`,
      [data.email?.trim().toLowerCase() || null, data.emailVerified, data.name, data.image]
    );
    const id = String((result as { insertId: number }).insertId);
    return {
      ...data,
      id,
      email: data.email?.trim().toLowerCase() || `instagram-user-${id}@users.invalid`,
    };
  },

  getUser: getUserById,

  async getUserByEmail(email) {
    const [rows] = await db.query<CreatorRow[]>(
      'SELECT id, email, email_verified, name, image FROM creator_users WHERE email = ? LIMIT 1',
      [email.trim().toLowerCase()]
    );
    return rows[0] ? toUser(rows[0]) : null;
  },

  async getUserByAccount({ provider, providerAccountId }) {
    const [rows] = await db.query<CreatorRow[]>(
      `SELECT u.id, u.email, u.email_verified, u.name, u.image
       FROM creator_identities i
       JOIN creator_users u ON u.id = i.owner_id
       WHERE i.provider = ? AND i.provider_user_id = ? LIMIT 1`,
      [provider, providerAccountId]
    );
    return rows[0] ? toUser(rows[0]) : null;
  },

  async updateUser(data) {
    const current = await getUserById(data.id);
    if (!current) throw new Error('Creator account not found.');
    const updated = { ...current, ...data };
    const email =
      !updated.email || updated.email.endsWith('@users.invalid')
        ? null
        : updated.email.trim().toLowerCase();
    await db.query(
      `UPDATE creator_users
       SET email = ?, email_verified = ?, name = ?, image = ?
       WHERE id = ?`,
      [email, updated.emailVerified, updated.name, updated.image, data.id]
    );
    return { ...updated, email: email ?? `instagram-user-${data.id}@users.invalid` };
  },

  async deleteUser(userId) {
    const existing = await getUserById(userId);
    if (!existing) return null;
    await db.query('DELETE FROM creator_users WHERE id = ?', [userId]);
    return existing;
  },

  async linkAccount(account: AdapterAccount) {
    if (!supportedProviders.has(account.provider)) {
      throw new Error(`Unsupported creator sign-in provider: ${account.provider}`);
    }
    await db.query(
      'INSERT INTO creator_identities (owner_id, provider, provider_user_id) VALUES (?, ?, ?)',
      [account.userId, account.provider, account.providerAccountId]
    );
    return account;
  },

  async unlinkAccount({ provider, providerAccountId }) {
    await db.query(
      'DELETE FROM creator_identities WHERE provider = ? AND provider_user_id = ?',
      [provider, providerAccountId]
    );
  },
};
