import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { isValidNewPassword } from '@/app/lib/passwordAuth';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESET_TOKEN_TTL_MINUTES = 30;
const GENERIC_REQUEST_MESSAGE = 'If an account exists for that email, a password reset link has been sent.';

interface CreatorUserRow extends RowDataPacket {
  id: number;
  is_rate_limited: number | boolean | null;
}

interface PasswordResetRow extends RowDataPacket {
  user_id: number;
}

function getFrontendBaseUrl(): URL {
  const configuredUrl = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl) {
    throw new Error('SITE_URL must be configured to send password reset links.');
  }

  const url = new URL(configuredUrl);
  // if (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && url.protocol === 'http:')) {
  //   throw new Error('SITE_URL must use HTTPS in production.');
  // }
  return url;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => undefined);
    const email =
      typeof body === 'object' && body !== null && 'email' in body && typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 });
    }

    const frontendBaseUrl = getFrontendBaseUrl();
    const emailAccount = process.env.EMAIL;
    const emailPassword = process.env.SECRET_KEY;
    if (!emailAccount || !emailPassword) {
      throw new Error('EMAIL and SECRET_KEY must be configured to send password reset links.');
    }

    const [users] = await db.query<CreatorUserRow[]>(
      `SELECT u.id,
              p.created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE) AS is_rate_limited
       FROM creator_users u
       LEFT JOIN creator_password_resets p ON p.user_id = u.id
       WHERE u.email = ?
       LIMIT 1`,
      [email]
    );
    if (!users[0]) {
      console.info('Password reset request ignored: no matching account.');
      return NextResponse.json({ message: GENERIC_REQUEST_MESSAGE });
    }
    if (users[0].is_rate_limited) {
      console.info('Password reset request ignored: rate limited.');
      return NextResponse.json({ message: GENERIC_REQUEST_MESSAGE });
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    const userId = users[0].id;
    await db.query(
      `INSERT INTO creator_password_resets (user_id, token_hash, expires_at)
       VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ${RESET_TOKEN_TTL_MINUTES} MINUTE))
       ON DUPLICATE KEY UPDATE
         token_hash = VALUES(token_hash),
         expires_at = VALUES(expires_at),
         created_at = CURRENT_TIMESTAMP`,
      [userId, tokenHash]
    );

    const resetUrl = new URL('/login', frontendBaseUrl);
    resetUrl.searchParams.set('token', token);
    const escapedResetUrl = escapeHtml(resetUrl.toString());
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: emailAccount, pass: emailPassword },
    });

    const brandName = 'Infographics Posters';
    const preheader = `Reset your password. This link expires in ${RESET_TOKEN_TTL_MINUTES} minutes.`;
    const fontStack = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f7;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${preheader}
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:28px 32px;background-color:#1e2939;border-bottom:4px solid #007595;">
              <span style="font-family:${fontStack};font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">
                ${brandName}
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 12px 32px;font-family:${fontStack};">
              <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;font-weight:700;color:#1e2939;">
                Reset your password
              </h1>
              <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#374151;">
                We received a request to reset the password for your account.
                Click the button below to choose a new one.
              </p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
                This link expires in <strong>${RESET_TOKEN_TTL_MINUTES} minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" style="padding:24px 32px 28px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" bgcolor="#007595" style="border-radius:8px;">
                    <a href="${escapedResetUrl}" target="_blank"
                       style="display:inline-block;padding:14px 32px;font-family:${fontStack};font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;background-color:#007595;">
                      Reset password
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td style="padding:0 32px 28px 32px;font-family:${fontStack};">
              <p style="margin:0 0 6px 0;font-size:13px;line-height:1.5;color:#6b7280;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0;font-size:13px;line-height:1.5;word-break:break-all;">
                <a href="${escapedResetUrl}" target="_blank" style="color:#007595;text-decoration:underline;">${escapedResetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Didn't request this? -->
          <tr>
            <td style="padding:0 32px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#eef6f8;border-left:4px solid #007595;border-radius:6px;">
                <tr>
                  <td style="padding:16px 20px;font-family:${fontStack};">
                    <p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#1e2939;">
                      Didn't request this?
                    </p>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
                      If you didn't ask to reset your password, you can safely ignore this email.
                      Your current password will remain unchanged.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <p style="margin:16px 0 0 0;font-family:${fontStack};font-size:12px;color:#9ca3af;">
          &copy; ${new Date().getFullYear()} ${brandName}
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = [
      `Reset your ${brandName} password`,
      '',
      'We received a request to reset the password for your account.',
      `Use the link below to choose a new one. It expires in ${RESET_TOKEN_TTL_MINUTES} minutes:`,
      '',
      resetUrl.toString(),
      '',
      "Didn't request this?",
      "If you didn't ask to reset your password, you can safely ignore this email. Your current password will remain unchanged.",
    ].join('\n');

    try {
      const delivery = await transporter.sendMail({
        from: emailAccount,
        to: email,
        subject: `Reset your ${brandName} password`,
        text,
        html,
      });
      if (delivery.accepted.length === 0 || delivery.rejected.length > 0) {
        throw new Error('SMTP server did not accept the password reset recipient.');
      }
      // console.info('Password reset email accepted by SMTP server.');
    } catch (error) {
      await db.query('DELETE FROM creator_password_resets WHERE user_id = ? AND token_hash = ?', [userId, tokenHash]);
      throw error;
    }

    return NextResponse.json({ message: GENERIC_REQUEST_MESSAGE });
  } catch (error) {
    console.error('Password reset request failed:', error);
    return NextResponse.json({ message: 'Unable to send a password reset link. Please try again later.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => undefined);
    const token = typeof body === 'object' && body !== null && 'token' in body && typeof body.token === 'string' ? body.token : '';
    const password =
      typeof body === 'object' && body !== null && 'password' in body && typeof body.password === 'string' ? body.password : '';

    if (!/^[a-f0-9]{64}$/.test(token) || !isValidNewPassword(password)) {
      return NextResponse.json({ message: 'Invalid reset request.' }, { status: 400 });
    }

    const connection = await db.getConnection();
    let transactionStarted = false;
    try {
      await connection.beginTransaction();
      transactionStarted = true;

      const [resets] = await connection.query<PasswordResetRow[]>(
        `SELECT user_id
         FROM creator_password_resets
         WHERE token_hash = ? AND expires_at > UTC_TIMESTAMP()
         LIMIT 1
         FOR UPDATE`,
        [hashToken(token)]
      );
      if (!resets[0]) {
        await connection.rollback();
        transactionStarted = false;
        return NextResponse.json({ message: 'Invalid or expired reset link.' }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      await connection.query('UPDATE creator_users SET password_hash = ? WHERE id = ?', [passwordHash, resets[0].user_id]);
      const [deleted] = await connection.query<ResultSetHeader>('DELETE FROM creator_password_resets WHERE token_hash = ?', [
        hashToken(token),
      ]);
      if (deleted.affectedRows !== 1) {
        throw new Error('Password reset token could not be consumed.');
      }

      await connection.commit();
      transactionStarted = false;
      return NextResponse.json({ message: 'Password updated.' });
    } catch (error) {
      if (transactionStarted) await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Password reset failed:', error);
    return NextResponse.json({ message: 'Unable to update your password. Please try again.' }, { status: 500 });
  }
}
