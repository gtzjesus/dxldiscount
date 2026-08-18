import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductGallery from '@/components/product/ProductGallery';
import ProductDetailContent from '@/components/product/ProductDetailContent';

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  originalPrice?: number; // 👈 1. Añadido a la interfaz
  stock: number;
  itemNumber: string;
  description?: string;
  conditionNotes?: string;
  imageUrl?: string;
  extraImagesUrls?: string[];
  categoryName?: string;
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  const QUERY = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    price,
    originalPrice, // 👈 2. Pedido a Sanity
    stock,
    itemNumber,
    description,
    conditionNotes, 
    "imageUrl": image.asset->url,
    "extraImagesUrls": extraImages[].asset->url,
    "categoryName": category->title
  }`;

  return await client.fetch(QUERY, { slug }, { cache: 'no-store' });
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20 selection:bg-teal-500 selection:text-white">
      <div className="w-full bg-white grid grid-cols-1 md:grid-cols-2">
        <div className="w-full bg-white">
          <ProductGallery
            imageUrl={product.imageUrl}
            extraImagesUrls={product.extraImagesUrls}
            productName={product.name}
          />
        </div>

        <div className="w-full bg-white p-6 sm:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200">
          <div className="max-w-md mx-auto w-full">
            <ProductDetailContent product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}