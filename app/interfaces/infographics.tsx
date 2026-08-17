export interface InfographicCardProps {
  item: Article;
}

export interface Article {
  articleId: number;
  catId: number;
  title: string;
  alias: string;
  introDescription: string;
  fullDescription: string;
  featured: number;
  metaKey: string;
  metaDescription: string;
  hits: number;
  rating: string;
  imgPrefix: string;
  fullImageUrl: string;
  thumbImageUrl: string;
  imageAltText: string;
  facebook: string;
  facebookUrl: string;
  twitter: string;
  twitterUrl: string;
  created: string;
  type: string;
  authorUrl: string;
  author: string;
  authorEmail: string;
  embedCode: string;
  status: number;
  paypalTransaction: string;
  catalias: string;
  cattitle: string;
}
