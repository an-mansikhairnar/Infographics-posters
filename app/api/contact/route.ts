// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   const body = await request.json();

//   console.log('Received:', body);

//   return NextResponse.json({
//     message: 'Data received successfully',
//     data: body,
//   });
// }

// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const { name, email, subject, message } = await request.json();

//     const query = `
//       INSERT INTO contact_us
//       (name, email, subject, message)
//       VALUES ($1, $2, $3, $4)
//       RETURNING *;
//     `;

//     const values = [name, email, subject, message];

//     const result = await pool.query(query, values);

//     return NextResponse.json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error) {
//     console.error('Database Error:', error);

//     return NextResponse.json({ success: false, message: 'Failed to save data' }, { status: 500 });
//   }
// }

import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Extract JSON properties sent from the client
    const { name, email, subject, message ,sendcopy} = await request.json();

    // 2. Validate that values are not empty
    // if (!name || !email || !subject || !message) {
    //   return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    // }

    // 3. Define the parameterized query using placeholders
    const query = `
  INSERT INTO contacts
  (name, email, subject, message, sendcopy)
  VALUES (?, ?, ?, ?, ?);
`;

    const values = [name, email, subject, message, sendcopy ? 1 : 0]; // Convert boolean to integer for database

    // 4. Run the query with parameters array matching the template order
    const [result] = await db.query(query, values);

    // 5. Return success response
    return NextResponse.json({ message: 'Contact details saved successfully!', result }, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to save contact information.',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
