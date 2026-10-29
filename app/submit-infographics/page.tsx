
import { siteMetadata, siteOpenGraph } from '../constants/metadata';
import SubmitInfographics from './SubmitInfographics';

export const metadata = {
  title: 'Submit Infographics',
  description: siteMetadata.defaultDescription,
  keywords: siteMetadata.defaultKeywords,
  authors: [{ name: siteMetadata.author }],
  openGraph: {
    ...siteOpenGraph,
    title: 'Submit Infographics',
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ temp_image?: string | string[] }>;
}) {
  const { temp_image } = await searchParams;
  const initialImageUrl = Array.isArray(temp_image) ? temp_image[0] : temp_image;

  return <SubmitInfographics initialImageUrl={initialImageUrl} />;
}
