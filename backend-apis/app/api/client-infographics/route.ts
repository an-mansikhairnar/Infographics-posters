import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [clientInfo] = await db.query('SELECT * FROM client_infographics ORDER BY id DESC');
    return NextResponse.json(clientInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      title,
      catId,
      email,
      desc,
      imgUrl,
      facebook,
      facebookUrl,
      twitter,
      twitterUrl,
      instagram,
      instagramUrl,
      paypalTransaction,
      payerId,
      paypalId,
      amount,
      currency,
      state,
      address,
      liveUrl,
    } = body;

    if (!clientName?.trim() || !title?.trim() || !catId || !email?.trim() || !desc?.trim() || !imgUrl?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title, category, email, description and infographic URL are required.',
        },
        { status: 400 }
      );
    }

    if (!paypalTransaction || !paypalId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Valid PayPal payment is required.',
        },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `
        INSERT INTO client_infographics
        (
          payer_id,
          client_name,
          title,
          email,
          address,
          fullDescription,
          facebook,
          facebookUrl,
          twitter,
          twitterUrl,
          instagram,
          instagramUrl,
          paypalTransaction,
          amount,
          currency,
          state,
          type,
          imgUrl,
          liveUrl,
          publishDate,
          paypalId,
          status,
          catId
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payerId,
        clientName.trim(),
        title.trim(),
        email.trim(),
        address?.trim() || '',
        desc.trim(),
        facebook?.trim() || '',
        facebookUrl?.trim() || '',
        twitter?.trim() || '',
        twitterUrl?.trim() || '',
        instagram?.trim() || null,
        instagramUrl?.trim() || null,
        paypalTransaction,
        Number(amount) || 30,
        currency || 'USD',
        state || payerId,
        'Paid',
        imgUrl.trim(),
        liveUrl?.trim() || '',
        new Date(),
        paypalId,
        0,
        Number(catId),
      ]
    );

    const insertResult = result as { insertId: number };

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

