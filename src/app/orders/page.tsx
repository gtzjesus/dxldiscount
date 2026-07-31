'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  // Aquí después conectaremos las órdenes reales de Supabase o Clerk
  const hasOrders = false; 

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 pb-32 pt-12 px-4 max-w-2xl mx-auto selection:bg-orange-500 selection:text-black">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-black tracking-tight uppercase italic text-orange-500">Order History</h1>
      </div>

      {!hasOrders ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-600">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black mb-2 tracking-tight uppercase italic text-zinc-300">No orders placed yet</h2>
          <p className="text-zinc-500 text-xs mb-6 max-w-xs font-mono uppercase tracking-widest">
            Your completed transactions and tracking info will appear here.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-orange-500 text-black font-black uppercase italic rounded-xl text-xs hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/10"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Aquí mapearemos las órdenes reales después */}
          <p className="text-xs font-mono text-zinc-400">List of orders goes here...</p>
        </div>
      )}
    </div>
  );
}