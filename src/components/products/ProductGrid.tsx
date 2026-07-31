import { Product } from '@/sanity/lib/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50  border border-dashed border-slate-200">
        <p className="text-slate-500 text-sm font-medium">No products available.</p>
      </div>
    );
  }

  // Agrupamos en bloques de 2 para el patrón asimétrico (2 y 1)
  const chunkSize = 2;
  const chunks: Product[][] = [];

  for (let i = 0; i < products.length; i += chunkSize) {
    chunks.push(products.slice(i, i + chunkSize));
  }

  return (
    <div className="w-full flex justify-center flex-col gap-2 max-w-4xl mx-auto  p-2 ">
      {chunks.map((chunk, index) => {
        // Cada tercer bloque muestra solo 1 producto en ancho completo
        const isSingle = (index + 1) % 3 === 0;

        if (isSingle) {
          const product = chunk[0];
          if (!product) return null;
          return (
            <div
              key={`single-${product._id}`}
              className="w-full bg-white overflow-hidden shadow-sm"
            >
              <ProductCard product={product} />
            </div>
          );
        } else {
          return (
            <div
              key={`chunk-${index}`}
              className="grid grid-cols-2 sm:grid-cols-2 gap-2"
            >
              {chunk.map((product) => (
                <div
                  key={product._id}
                  className="bg-white overflow-hidden shadow-sm flex flex-col"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
}