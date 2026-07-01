
// export interface InfographicItem {
//   id: number;
//   image: string;
//   title: string;
//   category: string;
//   description: string;
//   hits: number;
// }

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

//   export interface Article {
//   articleId: number;
//   title: string;
//   introDescription: string;
//   fullDescription: string;
//   catId: number;

//   imgPrefix: string;
//   fullImageUrl: string;
//   thumbImageUrl: string;
//   imgFolder: string;
//   imageAltText: string;

//   featured: number;
//   hits: number;
//   rating: number;

//   alias: string;
//   type: string;

//   author: string;
//   authorUrl: string;

//   facebook: string;
//   facebookUrl: string;

//   twitter: string;
//   twitterUrl: string;

//   embedCode: string;

//   metaTitle: string;
//   metaKey: string | null;
//   metaDescription: string | null;

//   status: number;
//   created: string;

//   authorEmail: string;
//   paypalTransaction: string;

//   instagram: string;
//   instagramUrl: string;
// }
