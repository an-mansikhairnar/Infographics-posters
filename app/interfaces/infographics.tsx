
export interface InfographicItem {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
  hits: number;
}

export interface InfographicCardProps {
  item: InfographicItem;
}