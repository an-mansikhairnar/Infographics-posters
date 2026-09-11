import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '../../lib/db';
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { name, email, subject, message, sendcopy } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'All fields are required'
                },
                { status: 400 }
            );
        }

        const sendCopy = sendcopy === true ? 1 : 0;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.SECRET_KEY
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: sendCopy ? email : undefined,
            cc: process.env.BCC_EMAIL,
            bcc: process.env.BCC_EMAIL,
            subject,
            html: `
    <div style="margin-bottom: 8px;">
      <strong style="margin-right: 8px;">Name</strong> ${name}
    </div>

    <div style="margin-bottom: 8px;">
      <strong style="margin-right: 8px;">Email</strong> ${email}
    </div>

    <div style="margin-bottom: 8px;">
      <strong style="margin-right: 8px;">Subject</strong> ${subject}
    </div>

    <div>
      <strong style="margin-right: 8px;">Message</strong>${message}
    </div>
  `
        });

        const sql = `
      INSERT INTO contacts
      (name, email, subject, message, sendcopy)
      VALUES (?, ?, ?, ?, ?)
    `;

        await db.query(sql, [name, email, subject, message, sendCopy]);

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully'
        });
    } catch (error) {
        console.error('Mail API error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Unable to send email'
            },
            { status: 500 }
        );
    }
}
