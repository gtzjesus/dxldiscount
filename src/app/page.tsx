import { client } from '@/sanity/lib/client';
import ProductGrid from '@/components/products/ProductGrid';

// Definición del tipo de producto
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

// Función para obtener los productos desde Sanity
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
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Renderizado mediante Componente Modular */}
        <ProductGrid products={products} />
      </main>
    </div>
  );
}