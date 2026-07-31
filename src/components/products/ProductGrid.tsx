import { Product } from '@/sanity/lib/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-dashed border-slate-200 m-4">
        <p className="text-slate-500 text-sm font-medium">No products available.</p>
      </div>
    );
  }

  return (
    // Contenedor principal que cubre todo a lo ancho con líneas exteriores y divisorias finas
    <div className="w-full bg-slate-200 border-y border-slate-200 grid grid-cols-2">
      {products.map((product, index) => {
        // Determinamos si está en la columna derecha para ponerle una línea divisoria vertical fina a la izquierda
        const isRightColumn = index % 2 !== 0;

        return (
          <div
            key={product._id}
            className={`bg-white border-b border-slate-200 ${
              isRightColumn ? 'border-l border-slate-200' : ''
            }`}
          >
            <ProductCard product={product} />
          </div>
        );
      })}
    </div>
  );
}