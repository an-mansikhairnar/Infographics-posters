import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const [clientInfo] = await db.query(
      'SELECT * FROM client_infographics ORDER BY id DESC'
    );
    return NextResponse.json(clientInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SECRET_KEY,
  },
});

// ---------- helpers ----------

// Optional text field: undefined / null / whitespace -> ''
const optStr = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : value != null ? String(value).trim() : '';

// Escape user input before putting it in the email HTML
const esc = (value: unknown): string =>
  optStr(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Required fields
    const clientName = optStr(body.clientName);
    const title = optStr(body.title);
    const email = optStr(body.email);
    const desc = optStr(body.desc);
    const imgUrl = optStr(body.imgUrl);
    const catId = Number(body.catId);
    const paypalTransaction = optStr(body.paypalTransaction);
    const paypalId = optStr(body.paypalId);

    const payerId = optStr(body.payerId);
    const address = optStr(body.address);
    const facebook = optStr(body.facebook);
    const facebookUrl = optStr(body.facebookUrl);
    const twitter = optStr(body.twitter);
    const twitterUrl = optStr(body.twitterUrl);
    const liveUrl = optStr(body.liveUrl);
    const state = optStr(body.state) || payerId;
    const currency = optStr(body.currency) || 'USD';
    const amount = Number(body.amount) || 30;

    // ---------- validation ----------
    if (!clientName || !title || !catId || !email || !desc || !imgUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Title, category, email, description and infographic URL are required.',
        },
        { status: 400 }
      );
    }

    if (!paypalTransaction || !paypalId) {
      return NextResponse.json(
        { success: false, message: 'Valid PayPal payment is required.' },
        { status: 400 }
      );
    }

    // ---------- insert ----------
    const row: Record<string, string | number | Date> = {
      payer_id: payerId,
      client_name: clientName,
      title,
      email,
      address,
      fullDescription: desc,
      facebook,
      facebookUrl,
      twitter,
      twitterUrl,
      paypalTransaction,
      amount,
      currency,
      state,
      type: 'Paid',
      imgUrl,
      liveUrl,
      publishDate: new Date(),
      paypalId,
      status: 0,
      catId,
    };

    const columns = Object.keys(row);
    const placeholders = columns.map(() => '?').join(', ');

    const [result] = await db.query(
      `INSERT INTO client_infographics (${columns.join(', ')}) VALUES (${placeholders})`,
      Object.values(row)
    );

    const insertResult = result as { insertId: number };

    // ---------- email (failure must not fail the submission) ----------
    try {
      const rows: [string, string][] = [
        ['Client Name', esc(clientName)],
        ['Email', `<a href="mailto:${esc(email)}">${esc(email)}</a>`],
        ['Infographic Title', esc(title)],
        ['Category ID', esc(catId)],
        ['Infographic URL', `<a href="${esc(imgUrl)}" target="_blank">${esc(imgUrl)}</a>`],
        ['Description', esc(desc)],
        ['PayPal Transaction', esc(paypalTransaction)],
        ['PayPal ID', esc(paypalId)],
        ['Amount', `${esc(amount)} ${esc(currency)}`],
      ];

      // Optional rows only appear when filled in
      const optionalRows: [string, string][] = [
        ['Facebook', facebook],
        ['Facebook URL', facebookUrl],
        ['Twitter', twitter],
        ['Twitter URL', twitterUrl],
        ['Payer ID', payerId],
        ['State', state],
        ['Address', address],
        ['Live URL', liveUrl],
      ];
      optionalRows.forEach(([label, value]) => {
        if (value) rows.push([label, esc(value)]);
      });

      const tableRows = rows
        .map(([label, value]) => `<tr><th align="left">${label}</th><td>${value}</td></tr>`)
        .join('');

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: 'submission@infographicsposters.com',
        subject: 'Infographic Poster Submission',
        html: `
          <table cellspacing="5" cellpadding="5" border="0"
            style="width: 100%; max-width: 800px; font-family: Arial, sans-serif;">
            <tbody>${tableRows}</tbody>
          </table>
        `,
      });

    } catch (mailError) {
      console.error('Email sending error:', mailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Infographic submitted successfully.',
        id: insertResult.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Insert infographic error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit infographic.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}