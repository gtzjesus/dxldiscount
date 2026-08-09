'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilterNav from '@/components/products/ProductFilterNav'; // 👈 Tu componente de filtro
import { client } from '@/sanity/lib/client';

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function fetchProducts() {
      try {
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
        const data = await client.fetch(QUERY, {}, { cache: 'no-store' });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.categoryName === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <main className="w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-mono text-xs text-slate-400 animate-pulse uppercase tracking-widest">
              Loading Dxl Products...
            </p>
          </div>
        ) : (
          <>
            {/* El filtro alineado con el mismo ancho del grid */}
            <ProductFilterNav 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
              products={products} 
            />
            {/* El Grid de productos justo abajo */}
            <ProductGrid products={filteredProducts} />
          </>
        )}
      </main>
    </div>
  );
}