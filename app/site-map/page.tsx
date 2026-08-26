
import { siteMetadata, siteOpenGraph } from '../constants/metadata';
import SiteMapPage from './SiteMapPage';

export const metadata = {
  title: 'Sitemap',
  description: siteMetadata.defaultDescription,
  keywords: siteMetadata.defaultKeywords,
  authors: [{ name: siteMetadata.author }],
  openGraph: {
    ...siteOpenGraph,
    title: 'Sitemap',
  },
};


export default function Page() {
  return <SiteMapPage />;
}
