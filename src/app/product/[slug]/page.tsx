'use client';

import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/product/ProductGallery';
import ProductDetailContent from '@/components/product/ProductDetailContent';
import { use } from 'react';

interface Variant {
  _key?: string;
  title: string;
  price?: number;
  stock: number;
  itemNumber?: string;
  variantImagesUrls?: string[];
}

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  originalPrice?: number;
  stock: number;
  itemNumber: string;
  description?: string;
  conditionNotes?: string;
  imageUrl?: string;
  extraImagesUrls?: string[];
  categoryName?: string;
  variants?: Variant[];
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 📸 ESTO ES LO QUE FALTABA: Estado para controlar la imagen principal que muestra la galería
  const [currentMainImage, setCurrentMainImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchProduct() {
      const QUERY = `*[_type == "product" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        price,
        originalPrice,
        stock,
        itemNumber,
        description,
        conditionNotes, 
        "imageUrl": image.asset->url,
        "extraImagesUrls": extraImages[].asset->url,
        "categoryName": category->title,
        "variants": variants[] {
          _key,
          title,
          price,
          stock,
          itemNumber,
          "variantImagesUrls": variantImages[].asset->url
        }
      }`;

      const data = await client.fetch(QUERY, { slug });
      if (!data) {
        setLoading(false);
        return;
      }

      setProduct(data);
      // Inicializamos con la foto principal del producto o la primera de su variante por defecto
      const defaultImage = data.variants?.[0]?.variantImagesUrls?.[0] || data.imageUrl;
      setCurrentMainImage(defaultImage);
      setLoading(false);
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Cargando producto...</div>;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20 selection:bg-teal-500 selection:text-white">
      <div className="w-full bg-white grid grid-cols-1 md:grid-cols-2">
        <div className="w-full bg-white">
          <ProductGallery
            imageUrl={currentMainImage || product.imageUrl} // 👈 Usamos la imagen dinámica
            extraImagesUrls={product.extraImagesUrls}
            productName={product.name}
          />
        </div>

        <div className="w-full bg-white p-6 sm:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200">
          <div className="max-w-md mx-auto w-full">
            <ProductDetailContent 
              product={product} 
              onImageChange={(newUrl) => {
                if (newUrl) setCurrentMainImage(newUrl); // 👈 Conectamos el cambio de variante con la galería
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}