import { Category } from "../interfaces/category";


export async function getCategories(): Promise<Category[]> {
  const response = await fetch('/api/infographics');

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}