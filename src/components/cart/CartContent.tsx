'use client';

import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { Trash2, Plus, Minus, Truck, Store, CheckCircle2 } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useState, useEffect, useCallback } from 'react';

// Tasa de impuesto local (8.25% para El Paso, TX)
const TAX_RATE = 0.0825;
const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING_COST = 7.00;

export default function CartContent() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);

  // Estado para el método de entrega ('shipping' o 'pickup')
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping');

  // Cálculos de costos
  const subtotal = totalPrice();
  
  // Si elige pickup o si el subtotal es >= 75, el envío es 0. De lo contrario, cuesta $7.00
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : (isFreeShipping ? 0 : STANDARD_SHIPPING_COST);
  
  const taxAmount = subtotal * TAX_RATE;
  const finalTotal = subtotal + taxAmount + deliveryFee;

  // Cuánto le falta para el envío gratis
  const amountNeededForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  // Función para manejar el checkout de Stripe
  const handleCheckout = useCallback(async () => {
    if (!isSignedIn) {
      alert('Por favor inicia sesión para continuar');
      return;
    }

    if (items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    try {
      setLoading(true);

      const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items,
          email: userEmail,
          deliveryMethod,
          taxAmount,
          deliveryFee // 👈 Mandamos el costo de envío calculado al backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error desconocido en el servidor');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('No se generó la URL de pago');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Error en checkout:', error);
      alert(error.message || 'Error de red al procesar el pago');
      setLoading(false);
    }
  }, [items, user, isSignedIn, deliveryMethod, taxAmount, deliveryFee]);

  // Si el usuario acaba de iniciar sesión y venía de intentar pagar
  useEffect(() => {
    const shouldCheckout = sessionStorage.getItem('pending_checkout');
    if (isSignedIn && shouldCheckout === 'true' && items.length > 0 && !loading) {
      sessionStorage.removeItem('pending_checkout');
      handleCheckout();
    }
  }, [isSignedIn, items.length, loading, handleCheckout]);

  const handleSignInClick = () => {
    sessionStorage.setItem('pending_checkout', 'true');
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 pt-10 px-4 sm:px-6 max-w-xl mx-auto pb-32">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black tracking-tight uppercase italic text-slate-900">
          Shopping Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-700 transition-colors flex items-center gap-1 bg-rose-50 border border-rose-100 px-3 py-1"
        >
          <Trash2 className="w-3 h-3" /> Clear Cart
        </button>
      </div>

      {/* Barra de Progreso para Envío Gratis */}
      {subtotal > 0 && deliveryMethod === 'shipping' && (
        <div className="mb-6 bg-slate-900 text-white p-3 text-xs font-mono">
          {isFreeShipping ? (
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>🎉 You unlocked FREE Standard Shipping!</span>
            </div>
          ) : (
            <div>
              <span>Add <strong className="text-amber-400">${amountNeededForFreeShipping.toFixed(2)}</strong> more to get <strong className="text-amber-400">FREE Shipping!</strong></span>
              <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

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

      {/* Selector de Método de Entrega */}
      <div className="mb-6 space-y-2">
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
          Delivery Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDeliveryMethod('shipping')}
            className={`flex items-center justify-center gap-2 p-3 border text-xs font-mono font-bold uppercase transition-all ${
              deliveryMethod === 'shipping'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Truck className="w-4 h-4" />
            Shipping
          </button>

          <button
            type="button"
            onClick={() => setDeliveryMethod('pickup')}
            className={`flex items-center justify-center gap-2 p-3 border text-xs font-mono font-bold uppercase transition-all ${
              deliveryMethod === 'pickup'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Store className="w-4 h-4" />
            Local Pickup
          </button>
        </div>
{deliveryMethod === 'pickup' && (
          <div className="bg-amber-50/50 p-3 border border-amber-100 text-[11px] font-mono text-amber-900 relative overflow-hidden">
            <span className="text-amber-800 flex items-center gap-1.5 uppercase font-bold text-[10px] mb-1">
              <Store className="w-3 h-3" /> El Paso, TX. Local Pickup
            </span>
            <p className="font-bold text-slate-900">Warehouse Location Revelead After Checkout</p>
            
            {/* Contenido bloqueado / borroso hasta que compren */}
            <div className="relative mt-1">
              <div className="filter blur-[5px] select-none opacity-40 space-y-1 pointer-events-none">
                <p>Around Red Sands</p>
                <p>
                  Call 915-471-9129 to confirm best time for you.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección de Desglose de Precios */}
      <div className="space-y-3 mb-6 bg-slate-50 border border-slate-200/80 p-4 text-xs">
        <div className="flex justify-between items-center text-slate-600">
          <span>Subtotal</span>
          <span className="font-mono font-semibold">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-slate-600">
          <span>
            Shipping {deliveryMethod === 'pickup' ? '(Pickup)' : (isFreeShipping ? '(Free 🚀)' : '($7.00)')}
          </span>
          <span className="font-mono font-semibold">
            {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-600 border-b border-slate-200 pb-3">
          <span>Estimated Tax (8.25%)</span>
          <span className="font-mono font-semibold">${taxAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Total
          </span>
          <span className="text-2xl font-black text-slate-900">
            ${finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Botón de Checkout */}
      <div className="space-y-4 pb-10">
        {isSignedIn ? (
          <button
            onClick={handleCheckout}
            disabled={loading || items.length === 0}
            className="w-full py-4 bg-slate-900 text-white font-bold text-sm tracking-wide transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 hover:bg-slate-800 uppercase"
          >
            {loading ? 'Checking out...' : `Proceed to Checkout`}
          </button>
        ) : (
          <div onClick={handleSignInClick}>
            <SignInButton mode="modal" forceRedirectUrl="/cart">
              <button
                type="button"
                className="w-full py-4 bg-slate-900 text-white font-bold text-sm tracking-wide transition-all shadow-sm active:scale-[0.99] hover:bg-slate-800 uppercase"
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