import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch('https://server.infographicsposters.com/contactUs/mail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return NextResponse.json({ ok: res.ok, text }, { status: res.status });
}
