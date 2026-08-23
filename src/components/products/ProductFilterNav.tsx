'use client';

import { useMemo } from 'react';

interface ProductFilterNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  products: any[];
}

export default function ProductFilterNav({ activeCategory, onCategoryChange, products }: ProductFilterNavProps) {
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.categoryName || 'uncategorized')));
    return [
      { label: 'ALL', value: 'all' },
      ...uniqueCategories.map((cat) => ({ label: cat.toUpperCase(), value: cat }))
    ];
  }, [products]);

  const handleCategoryClick = (value: string) => {
    onCategoryChange(value);
    // Hace scroll suave hacia arriba de la página al cambiar de categoría
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="sticky top-0 z-40 max-w-2xl mx-auto w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="flex overflow-x-auto gap-2 scrollbar-hide py-3 px-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              className={`flex-shrink-0 px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all duration-200 border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 font-black'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}