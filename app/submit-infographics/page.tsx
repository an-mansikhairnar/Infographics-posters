
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

export default function Page() {
  return <SubmitInfographics />;
}
