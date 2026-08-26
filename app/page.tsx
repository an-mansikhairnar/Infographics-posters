import type { Metadata } from 'next';
import { Suspense } from 'react';
import InfographicsGrid from './component/InfographicsGrid/InfographicsGrid';
import { db } from '@/app/lib/db';
import { Category } from '@/app/interfaces/category';
import { siteMetadata, siteOpenGraph } from './constants/metadata';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const selectedCategory = params.category ? decodeURIComponent(params.category) : '';

  if (selectedCategory) {
    const [rows] = await db.query('SELECT * FROM category WHERE title = ? LIMIT 1', [selectedCategory]);
    const category = (rows as Category[])[0];

    if (category) {
      return {
        ...siteOpenGraph,
        title: category.metaTitle || `${category.title}`,
        description:
          category.metaDescription || `Browse ${category.title} infographics and posters from Infographics Posters.`,
        keywords: category.metaKey || `${category.title}, infographics, infographic posters`,
        authors: [{ name: siteMetadata.author }],
        openGraph: {
          title: category.metaTitle || `${category.title} Infographics`,
          description:siteMetadata.defaultDescription,
          url: siteMetadata.siteUrl,
          images: [siteMetadata.ogImage],

        },
      };
    }
  }

  return {
    title: 'Infographics Posters',
    description:
      'Extensive selection of well-designed infographics posters based on various topics from fashion, politics, entertainment, health, business to technology and others',
    keywords: 'infographics, infographics posters, information graphics, submit infographics',
    authors: [{ name: siteMetadata.author }],
    openGraph: {
      ...siteOpenGraph,
      title: 'Home',
      description: siteMetadata.defaultDescription,
      url: siteMetadata.siteUrl,
      images: [siteMetadata.ogImage],

    },
  };
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <InfographicsGrid />
    </Suspense>
  );
}
