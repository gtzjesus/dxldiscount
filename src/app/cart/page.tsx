'use client';

import { useCartStore } from '@/store/useCartStore';
import CartEmpty from '@/components/cart/CartEmpty';
import CartContent from '@/components/cart/CartContent';

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="min-h-screen bg-white text-slate-900 w-full">
      {items.length === 0 ? <CartEmpty /> : <CartContent />}
    </div>
  );
}