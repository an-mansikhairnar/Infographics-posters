import type { Metadata } from 'next';
import { Suspense } from 'react';
import InfographicsGrid from './component/InfographicsGrid/InfographicsGrid';
import { Category } from '@/app/interfaces/category';
import { siteMetadata, siteOpenGraph } from './constants/metadata';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;

  const category = params.category
    ? decodeURIComponent(params.category)
    : '';

  if (category) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category-meta?category=${encodeURIComponent(category)}`);

    if (response.ok) {
      const data = await response.json();

      return {
        ...siteOpenGraph,
        title: data.metadata.title,
        description: data.metadata.description,
        keywords: data.metadata.keywords,
        authors: [{ name: siteMetadata.author }],
        openGraph: {
          ...siteOpenGraph,
          title: data.metadata.title,
          description: data.metadata.description,
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
    keywords:
      'infographics, infographics posters, information graphics, submit infographics',
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
