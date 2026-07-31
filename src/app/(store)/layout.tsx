import { getAllProducts } from '@/sanity/lib/products';

export default async function HomePage() {
  // ⚡️ Sin useState, sin useEffect, sin spinners feos de carga
  const products = await getAllProducts();

  return (
    <div>
      {products.map((product) => (
        <div key={product._id}>{product.name} - ${product.price}</div>
      ))}
    </div>
  );
}