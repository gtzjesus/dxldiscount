'use client';

import { useCartStore } from '@/store/useCartStore';

interface ProductDetailContentProps {
  product: {
    _id: string;
    name: string;
    price: number;
    stock: number;
    itemNumber: string;
    description?: string;
    conditionNotes?: string; // <--- Añadido a la interfaz
    imageUrl?: string;
    slug: { current: string };
  };
}

export default function ProductDetailContent({ product }: ProductDetailContentProps) {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  // Verificamos si este producto ya está agregado en el carrito
  const isAlreadyInCart = items.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    if (isAlreadyInCart || product.stock === 0) return;

    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      slug: product.slug.current,
      itemNumber: product.itemNumber,
      stock: product.stock
    });
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div>
        {/* Nombre del producto */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
          {product.name}
        </h1>

        {/* Precio destacado */}
        <div className="text-3xl font-black text-slate-900 tracking-tight mb-6">
          ${product.price?.toFixed(2)}
        </div>

              {/* Badges superiores */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[10px] font-mono font-bold text-teal-600 uppercase tracking-widest bg-teal-50 border border-teal-100 px-3 py-1 rounded-md">
            SKU: {product.itemNumber || 'N/A'}
          </span>

          <span
            className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
              product.stock > 0
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}
          </span>
        </div>

        {/* Descripción */}
        <div className="border-t border-slate-100 pt-4 mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Product Description
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-light">
            {product.description || 'No detailed description available for this product.'}
          </p>
        </div>

        {/* Notas de Condición / Open-Box (Solo se muestra si el campo tiene texto) */}
        {product.conditionNotes && (
          <div className="bg-amber-50/70 border border-amber-200/80 p-4 mb-4">
            <h3 className="uppercase text-[10px] font-extrabold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>⚠️</span> Condition & Package Notes
            </h3>
            <p className="uppercase text-amber-800 text-xs leading-relaxed whitespace-pre-line">
              {product.conditionNotes}
            </p>
          </div>
        )}
      </div>

      {/* Botón conectado a Zustand */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isAlreadyInCart}
        className={`w-full py-4  font-bold text-sm tracking-wide transition-all shadow-sm ${
          product.stock === 0
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            : isAlreadyInCart
            ? 'bg-emerald-600 text-white cursor-default'
            : 'bg-slate-900 text-white active:scale-[0.99] hover:bg-slate-800'
        }`}
      >
        {product.stock === 0
          ? 'Temporarily Out of Stock'
          : isAlreadyInCart
          ? 'Added'
          : 'Add to Cart'}
      </button>
    </div>
  );
}