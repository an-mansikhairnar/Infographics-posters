import type { Metadata } from 'next';
import DetailPage from '@/app/component/DetailPage/DetailPage';
import { Article } from '@/app/interfaces/infographics';
import { siteMetadata, siteOpenGraph } from '@/app/constants/metadata';

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`);

  if (!response.ok) {
    return {
      title: 'Infographic Detail',
      description:
        'Extensive selection of well-designed infographics posters based on various topics from fashion, politics, entertainment, health, business to technology and others',
      openGraph: {
        ...siteOpenGraph,
        title: 'Infographic Detail',
      },
    };
  }

  const article: Article = await response.json();

  const plainText = (value?: string) =>
    (value || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const description =
    article.metaDescription ||
    plainText(article.introDescription) ||
    plainText(article.fullDescription) ||
    'View this infographic poster on Infographics Posters.';

  const shortDescription = description.slice(0, 160);

  const ogImage = article.fullImageUrl
    ? article.fullImageUrl
    : siteMetadata.ogImage;

  return {
    title: article.title,
    description: shortDescription,
    keywords:
      article.metaKey ||
      `${article.title}, infographics, infographic poster`,
    authors: [{ name: siteMetadata.author }],
    openGraph: {
      ...siteOpenGraph,
      title: article.title,
      description: shortDescription,
      url: `${siteMetadata.siteUrl}/article/${id}`,
      images: [ogImage],
    },
  };
}
export default async function Page() {
  return <DetailPage />;
}