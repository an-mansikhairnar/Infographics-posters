export const siteMetadata = {
  siteName:
    'Infographics posters | Collection of Unique and Creative Infographics!',
  siteUrl: 'https://www.infographicsposters.com/',
  ogImage:
    'https://www.infographicsposters.com/plugins/content/fb_tw_plus1/linkcmp.png',
  locale: 'en_GB',
  type: 'website' as const,
  author: 'Super User',
  defaultDescription:
    'Collection of Unique and Creative Infographics from around the world',
  defaultKeywords:
    'infographics, infographics posters, infographic, best infographics, unique infographics, creative infographics',
};

export const siteOpenGraph = {
  description: siteMetadata.defaultDescription,
  url: siteMetadata.siteUrl,
  images: [siteMetadata.ogImage],
  siteName: siteMetadata.siteName,
  locale: siteMetadata.locale,
  type: siteMetadata.type,
};