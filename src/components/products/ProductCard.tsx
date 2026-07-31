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
      className="relative flex flex-col items-center justify-between bg-white p-6 sm:p-10 overflow-hidden group transition-colors hover:bg-slate-50/50"
    >
      {/* Contenedor de la Imagen limpio y centrado */}
      <div className="relative aspect-square w-full max-w-[220px] bg-white overflow-hidden flex items-center justify-center mb-6">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-contain object-center"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-medium text-xs">
            Sin imagen
          </div>
        )}
      </div>

      {/* Información minimalista y centrada (Nonchalant style) */}
      <div className="flex flex-col items-center text-center space-y-2">
        <h3 className="font-medium text-slate-900 text-sm sm:text-base tracking-tight">
          {product.name}
        </h3>
        <span className="text-sm font-bold text-slate-900 tracking-tight">
          ${product.price?.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}