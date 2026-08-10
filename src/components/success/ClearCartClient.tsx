'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/useCartStore'; // Asegúrate que esta sea tu ruta correcta al store

export default function ClearCartClient() {
  const clearCart = useCartStore((state) => state.clearCart);
  const items = useCartStore((state) => state.items);
  const hasExecuted = useRef(false);

  useEffect(() => {
    // Evitamos ejecuciones dobles en desarrollo por React StrictMode
    if (hasExecuted.current) return;

    if (items.length > 0) {
      hasExecuted.current = true;

      // Llamamos a la API para bajar el stock en Sanity
      fetch('/api/stock/decrease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log('Stock descontado exitosamente en Sanity');
            clearCart(); // Limpiamos el carrito local
          } else {
            console.error('Error al descontar stock:', data.error);
          }
        })
        .catch((err) => {
          console.error('Error de red al actualizar stock:', err);
        });
    }
  }, [items, clearCart]);

  return null; // No renderiza nada visual, solo ejecuta la lógica
}