import { Category } from '../interfaces/Category';

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}
