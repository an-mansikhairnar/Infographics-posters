import type { Metadata } from 'next';
import DetailPage from '@/app/component/DetailPage/DetailPage';
import { db } from '@/app/lib/db';
import { Article } from '@/app/interfaces/infographics';
import { siteMetadata, siteOpenGraph } from '@/app/constants/metadata';

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const [rows] = await db.query('SELECT * FROM article WHERE articleId = ? LIMIT 1', [id]);
  const article = (rows as Article[])[0];

  if (!article) {
    return {
      title: 'Infographic Detail',
      description: 'Extensive selection of well-designed infographics posters based on various topics from fashion, politics, entertainment, health, business to technology and others',
      openGraph: {
        ...siteOpenGraph,
        title: 'Infographic Detail',
      },
    };
  }

  const plainText = (value?: string) =>
    (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const description =
    article.metaDescription ||
    plainText(article.introDescription) ||
    plainText(article.fullDescription) ||
    'View this infographic poster on Infographics Posters.';



  const ogImage = article.fullImageUrl
  ? siteMetadata.siteUrl + article.thumbImageUrl
  : siteMetadata.ogImage;

  return {
    title: article.title,
    description: description.slice(0, 160),
    keywords: article.metaKey || `${article.title}, infographics, infographic poster`,
    authors: [{ name: siteMetadata.author }],
    openGraph: {
      ...siteOpenGraph,
      title: article.title,
      description: description.slice(0, 160),
      url: siteMetadata.siteUrl,
      images: [ogImage],

    },
  };
}

export default async function Page() {
  return <DetailPage />;
}