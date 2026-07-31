'use client';

interface ProductInfoProps {
  product: {
    name: string;
    price: number;
    stock: number;
    itemNumber: string;
    description?: string;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div>
        {/* Badges superiores */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[10px] font-mono font-bold text-teal-600 uppercase tracking-widest bg-teal-50 border border-teal-100 px-3 py-1 ">
            SKU: {product.itemNumber || 'N/A'}
          </span>

          <span
            className={`text-[10px] font-extrabold px-3 py-1  uppercase tracking-wider ${
              product.stock > 0
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {product.stock > 0 ? `${product.stock} in Stock` : 'sold out'}
          </span>
        </div>

        {/* Nombre del producto */}
        <h1 className="uppercase text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
          {product.name}
        </h1>

        {/* Precio destacado */}
        <div className="text-3xl font-black text-slate-900 tracking-tight mb-6">
          ${product.price?.toFixed(2)}
        </div>

        {/* Descripción */}
        <div className="border-t border-slate-100 pt-4 mb-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Description
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-light">
            {product.description || 'Sin descripción detallada para este producto.'}
          </p>
        </div>
      </div>

      {/* Botón de acción principal */}
      <button
        disabled={product.stock === 0}
        className={`uppercase w-full py-4  font-bold text-sm tracking-wide transition-all shadow-sm ${
          product.stock > 0
            ? 'bg-slate-900 text-white '
            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
        }`}
      >
        {product.stock > 0 ? 'add to cart' : 'Agotado Temporalmente'}
      </button>
    </div>
  );
}