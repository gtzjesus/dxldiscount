import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/sanity/lib/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className="relative flex flex-col bg-white w-full h-full overflow-hidden"
    >
      {/* Contenedor de la Imagen */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 font-medium text-xs">
            <svg
              className="w-10 h-10 mb-2 stroke-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Sin imagen
          </div>
        )}

        {/* Top Badges: Categoría + Stock */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {product.categoryName ? (
            <span className="bg-slate-900/80 backdrop-blur-md text-cyan-300 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 shadow-sm">
              {product.categoryName}
            </span>
          ) : <div />}

          <span
            className={`text-[8px] font-extrabold px-2 py-1 rounded-full backdrop-blur-md shadow-sm uppercase tracking-wider ${
              product.stock > 0
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-500/90 text-white'
            }`}
          >
            {product.stock > 0 ? 'in Stock' : 'out of stock'}
          </span>
        </div>
      </div>

      {/* Contenido / Info del Producto */}
      <div className="px-3 py-4 flex flex-col flex-1 justify-between bg-white relative z-10">
        <div>
          <p className="text-[10px] font-mono font-medium text-teal-600 tracking-wider uppercase mb-1">
            SKU: {product.itemNumber || 'N/A'}
          </p>
          <h3 className="font-bold text-slate-800 line-clamp-1 text-base tracking-tight">
            {product.name}
          </h3>
        </div>

        <div className="mt-4 pt-2 flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              ${product.price?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}