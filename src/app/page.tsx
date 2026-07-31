import { client } from '@/sanity/lib/client';
import ProductGrid from '@/components/products/ProductGrid';

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  stock: number;
  itemNumber: string;
  description?: string;
  imageUrl?: string;
  categoryName?: string;
}

async function getProducts(): Promise<Product[]> {
  const QUERY = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    price,
    stock,
    itemNumber,
    description,
    "imageUrl": image.asset->url,
    "categoryName": category->title
  }`;

  return await client.fetch(QUERY, {}, { cache: 'no-store' });
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 100% de ancho sin márgenes restrictivos laterales */}
      <main className="w-full mx-auto py-6 sm:py-10">
        <ProductGrid products={products} />
      </main>
    </div>
  );
}