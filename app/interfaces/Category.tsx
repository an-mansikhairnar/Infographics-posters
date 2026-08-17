  export interface Category {
    catId: number;
    title: string;
    status: number;
    alias: string;
    created: string;
    metaTitle: string;
    metaKey: string | null;
    metaDescription: string | null;
  }

  export interface CategoryFormData {
  title: string;
  alias: string;
  status: number | null;
  metaTitle: string;
  metaKey: string;
  metaDescription: string;
}