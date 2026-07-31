'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function CartEmpty() {
  return (
    <div className="min-h-screen bg-white text-slate-900 pb-32 pt-16 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
        <ShoppingCart className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-black mb-2 tracking-tight">
        Your cart is empty
      </h2>
      <p className="text-slate-400 text-xs mb-6 max-w-xs font-light">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-[0.99]"
      >
        Explore Catalog
      </Link>
    </div>
  );
}