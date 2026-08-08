import Link from 'next/link';
import { ShoppingBag, Package, ArrowRight } from 'lucide-react';

export default function SuccessActions() {
  return (
    <div className="space-y-3">
      <Link
        href="/"
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider transition-all hover:bg-slate-800 active:scale-[0.99] shadow-sm"
      >
        <ShoppingBag className="w-4 h-4" /> Continue Shopping
      </Link>
      
      <Link
        href="/orders"
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-slate-900 border border-slate-300 font-bold text-xs uppercase tracking-wider transition-all hover:bg-slate-50 active:scale-[0.99]"
      >
        <Package className="w-4 h-4 text-slate-600" /> View Orders <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
      </Link>
    </div>
  );
}