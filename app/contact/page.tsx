
import { siteMetadata, siteOpenGraph } from '../constants/metadata';
import ContactUsPage from './ContactUsPage';

export const metadata = {
  title: 'Contact Us',
  description: siteMetadata.defaultDescription,
  keywords: siteMetadata.defaultKeywords,
  authors: [{ name: siteMetadata.author }],
  openGraph: {
    ...siteOpenGraph,
    title: 'Contact Us',
  },
};


export default function Page() {
  return <ContactUsPage />;
}
