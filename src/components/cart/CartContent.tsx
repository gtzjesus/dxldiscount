'use client';

import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useState, useEffect, useCallback } from 'react';

export default function CartContent() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);

  // Función para manejar el checkout de Stripe enviando el email del usuario
  const handleCheckout = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items,
          email: user?.primaryEmailAddress?.emailAddress // Pasamos el correo de Clerk
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirige a la pasarela de Stripe
      } else {
        alert(data.error || 'Hubo un error al procesar el pago');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error de red:', error);
      setLoading(false);
    }
  }, [items, user]);

  // Si el usuario acaba de iniciar sesión y venía de intentar pagar, disparamos el checkout automáticamente
  useEffect(() => {
    const shouldCheckout = sessionStorage.getItem('pending_checkout');
    if (isSignedIn && shouldCheckout === 'true' && items.length > 0 && !loading) {
      sessionStorage.removeItem('pending_checkout');
      handleCheckout();
    }
  }, [isSignedIn, items.length, loading, handleCheckout]);

  // Guardamos la bandera antes de que Clerk abra el modal de autenticación
  const handleSignInClick = () => {
    sessionStorage.setItem('pending_checkout', 'true');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-10 px-4 sm:px-6 max-w-xl mx-auto">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black tracking-tight">
          Shopping Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-700 transition-colors flex items-center gap-1 bg-rose-50 border border-rose-100 px-3 py-1"
        >
          <Trash2 className="w-3 h-3" /> Clear Cart
        </button>
      </div>

      {/* Lista de Items */}
      <div className="divide-y divide-slate-100 border-b border-slate-100 mb-6">
        {items.map((item) => {
          const maxStock = item.stock ?? 99;
          const isAtMaxStock = item.quantity >= maxStock;

          return (
            <div
              key={item._id}
              className="flex items-center justify-between gap-4 py-4 bg-slate-50/50 px-2"
            >
              <div className="flex items-center gap-3">
                {item.imageUrl ? (
                  <div className="relative w-16 h-16 overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-slate-200 flex-shrink-0" />
                )}
                <div>
                  <h3 className="uppercase text-xs font-bold text-slate-900 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Controles de Cantidad (+ / -) */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-200 bg-white overflow-hidden shadow-xs">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1 text-slate-600 transition-colors disabled:opacity-30 hover:bg-slate-100"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold font-mono text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 text-slate-600 transition-colors disabled:opacity-30 hover:bg-slate-100"
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
                className="text-xs text-rose-600 transition-colors p-2 font-mono bg-white border border-slate-200 hover:bg-rose-50"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Sección de Total y Checkout */}
      <div className="space-y-4 pb-10">
        <div className="flex justify-between items-center bg-slate-50 border border-slate-200/80 p-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Estimated Total 
          </span>
          <span className="text-2xl font-black text-slate-900">
            ${totalPrice().toFixed(2)}
          </span>
        </div>

        {isSignedIn ? (
          <button
            onClick={handleCheckout}
            disabled={loading || items.length === 0}
            className="w-full py-4 bg-slate-900 text-white font-bold text-sm tracking-wide transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 hover:bg-slate-800"
          >
            {loading ? 'Checking out...' : 'Proceed to Checkout'}
          </button>
        ) : (
          <div onClick={handleSignInClick}>
            <SignInButton mode="modal" forceRedirectUrl="/cart">
              <button
                type="button"
                className="w-full py-4 bg-slate-900 text-white font-bold text-sm tracking-wide transition-all shadow-sm active:scale-[0.99] hover:bg-slate-800"
              >
                Checkout
              </button>
            </SignInButton>
          </div>
        )}
      </div>
    </div>
  );
}