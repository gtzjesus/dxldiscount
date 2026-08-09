import { client } from './client';

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  stock: number;
  itemNumber: string;
  description?: string;
  conditionNotes?: string; // 👈 1. Añadido a la interfaz
  imageUrl?: string;
  categoryName?: string;
}

export async function getAllProducts(): Promise<Product[]> {
  const QUERY = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    price,
    stock,
    itemNumber,
    description,
    conditionNotes, 
    "imageUrl": image.asset->url,
    "categoryName": category->title
  }`;

  return await client.fetch(QUERY, {}, { next: { revalidate: 0 } });
}