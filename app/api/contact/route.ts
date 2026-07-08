import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch('https://server.infographicsposters.com/contactUs/mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json({ ok: false, text }, { status: res.status });
    }

    return NextResponse.json({ ok: true, text }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send contact form';
    return NextResponse.json({ ok: false, text: message }, { status: 502 });
  }
}
