import { Product } from '@/sanity/lib/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white border border-dashed border-slate-200 my-4">
        <p className="text-slate-500 text-sm font-medium">No products available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full bg-slate-200 border-y border-slate-200 grid grid-cols-2">
      {products.map((product, index) => {
        const isRightColumn = index % 2 !== 0;

        return (
          <div
            key={product._id}
            className={`uppercase bg-white border-b border-slate-200 ${
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