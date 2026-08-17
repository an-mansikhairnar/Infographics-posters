export interface ArticleFormData {
  title: string;
  alias: string;
  catId: string;
  featured: string;
  type: string;
  status: string;
  introDescription: string;
  fullDescription: string;
  authorEmail: string;
  paypalId: string;
}
// Shape of a row as stored in / returned from the `article` table
export interface Article {
  articleId: number;
  title: string;
  alias: string;
  catId: number;
  featured: string;
  type: 'free' | 'paid';
  status: number; // 0 or 1 (tinyint)
  introDescription: string;
  fullDescription: string;
  imgFolder: string;
  fullImageUrl: string; // stored filename only
  thumbImageUrl: string; // stored filename only
  imageAltText: string;
  metaTitle: string;
  metaKey: string;
  metaDescription: string;
  author: string;
  authorUrl: string;
  facebook: string;
  facebookUrl: string;
  instagram: string;
  instagramUrl: string;
  imgPrefix: string;
  twitter: string;
  twitterUrl: string;
  embedCode: string;
  hits: number;
  rating: number;
  created: string; // MySQL DATETIME comes back as a string
  authorEmail: string;
  paypalId: string;
}

export interface Articles {
  articleId: number;
}
