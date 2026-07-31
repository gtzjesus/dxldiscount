'use client';

import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartContent() {
  const { items, addItem, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-10 px-4 sm:px-6 max-w-xl mx-auto">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6  border-slate-100 pb-4">
        <h1 className="text-2xl font-black tracking-tight">
          Shopping Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-700 transition-colors flex items-center gap-1 bg-rose-50  border-rose-100 px-3 py-1 "
        >
          <Trash2 className="w-3 h-3" /> Clear Cart
        </button>
      </div>

      {/* Lista de Items */}
      <div className="divide-y divide-slate-100  border-slate-100 mb-6">
        {items.map((item) => {
          // Asumimos que item.stock viene guardado desde Zustand, si no usa un respaldo alto o 99
          const maxStock = item.stock ?? 99;
          const isAtMaxStock = item.quantity >= maxStock;

          return (
            <div
              key={item._id}
              className="flex items-center justify-between gap-4 py-4 bg-slate-50/50"
            >
              <div className="flex items-center gap-3">
                {item.imageUrl ? (
                  <div className="relative w-16 h-16 overflow-hidden bg-white  border-slate-200 flex-shrink-0 ">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-slate-200 flex-shrink-0 " />
                )}
                <div>
                  {/* <span className="text-[10px] font-mono font-bold text-teal-600 uppercase tracking-widest bg-teal-50  border-teal-100 px-2 py-0.5 inline-block mb-1 ">
                    SKU: {item.itemNumber || 'N/A'}
                  </span> */}
                  <h3 className="uppercase text-xs font-bold text-slate-900 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Controles de Cantidad (+ / -) */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center  border-slate-200  bg-white overflow-hidden shadow-xs">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1  text-slate-600 transition-colors disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold font-mono text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1  text-slate-600 transition-colors disabled:opacity-30"
                        disabled={isAtMaxStock}
                        title={isAtMaxStock ? 'Max stock reached' : ''}
                        >
                        <Plus className="w-3 h-3" />
                        </button>
                    </div>

                    {isAtMaxStock && (
                      <span className="text-[9px] font-mono text-rose-500 font-medium">
                        Max stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeItem(item._id)}
                className="text-xs text-rose-600 transition-colors p-2 font-mono bg-white  border-slate-200  "
                title="Remove item"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Sección de Total y Checkout */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-slate-50  border-slate-200/80 p-4 ">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Estimated Total 
          </span>
          <span className="text-2xl font-black text-slate-900">
            ${totalPrice().toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => alert('Proceeding to checkout...')}
          className="w-full py-4 bg-slate-900 text-white font-bold text-sm tracking-wide transition-all shadow-sm active:scale-[0.99] "
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}