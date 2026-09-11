import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const categoryParam = request.nextUrl.searchParams.get('category');

    if (!categoryParam) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    const selectedCategory = decodeURIComponent(categoryParam).trim();

    const [rows] = await db.query(
      'SELECT * FROM category WHERE title = ? LIMIT 1',
      [selectedCategory]
    );

    const category = (rows as any[])[0];

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      category,
      metadata: {
        title: category.metaTitle || category.title,
        description:
          category.metaDescription ||
          `Browse ${category.title} infographics and posters from Infographics Posters.`,
        keywords:
          category.metaKey ||
          `${category.title}, infographics, infographic posters`,
      },
    });
  } catch (error) {
    console.error('Category API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
