import type { Metadata } from 'next';
import DetailPage from '@/app/component/DetailPage/DetailPage';
import { Article } from '@/app/interfaces/infographics';
import { siteMetadata, siteOpenGraph } from '@/app/constants/metadata';
import {
  buildAbsoluteImageUrl,
  getPublicOrigin,
} from '@/app/utils/imageUrl';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const createUrlSlug = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\'’]/g, '')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = slug.replace(/\.html$/i, '');

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);

  if (!response.ok) {
    return {
      title: 'Infographic Detail',
      description:
        'Extensive selection of well-designed infographics posters based on various topics from fashion, politics, entertainment, health, business to technology and others',
      openGraph: {
        ...siteOpenGraph,
        title: 'Infographic Detail',
        url: `${siteMetadata.siteUrl.replace(/\/$/, '')}/`,
        images: [
          {
            url: siteMetadata.ogImage,
            alt: 'Infographics Posters',
          },
        ],
      },
    };
  }

  const articles: Article[] = await response.json();
  const article = articles.find((item) => {
    if (!item.alias) return false;
    const alias = createUrlSlug(item.alias);
    const normalizedAlias = createUrlSlug(normalizedSlug);

    return alias === normalizedAlias || item.alias === normalizedSlug || `${item.alias}.html` === slug;
  });

  if (!article) {
    return {
      title: 'Infographic Detail',
      description:
        'Extensive selection of well-designed infographics posters based on various topics from fashion, politics, entertainment, health, business to technology and others',
      openGraph: {
        ...siteOpenGraph,
        title: 'Infographic Detail',
        url: `${siteMetadata.siteUrl.replace(/\/$/, '')}/`,
        images: [
          {
            url: siteMetadata.ogImage,
            alt: 'Infographics Posters',
          },
        ],
      },
    };
  }

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
  const ogImage = buildAbsoluteImageUrl(
    article.fullImageUrl || article.thumbImageUrl,
    article.imgPrefix || getPublicOrigin()
  );
  const articleUrl = `${siteMetadata.siteUrl.replace(/\/$/, '')}/infographics/${createUrlSlug(article.alias || normalizedSlug)}.html`;

  return {
    title: article.title,
    description: shortDescription,
    keywords: article.metaKey || `${article.title}, infographics, infographic poster`,
    authors: [{ name: siteMetadata.author }],
    openGraph: {
      ...siteOpenGraph,
      title: article.title,
      description: shortDescription,
      url: articleUrl,
      type: 'article',
      images: [{ url: ogImage, alt: article.imageAltText || article.title }],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function Page() {
  return <DetailPage />;
}
