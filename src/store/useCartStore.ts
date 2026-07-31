import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  slug: string;
  quantity: number;
  itemNumber: string;
  stock: number; // Agregado para controlar el límite disponible
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (_id: string) => void;
  updateQuantity: (_id: string, quantity: number) => void; // Función añadida
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item._id === product._id);

        if (existingIndex > -1) {
          const newItems = [...currentItems];
          const item = newItems[existingIndex];
          
          // Solo sumamos si no supera el stock disponible
          if (item.quantity < item.stock) {
            item.quantity += 1;
            set({ items: newItems });
          }
        } else {
          // Si es nuevo, lo agregamos con cantidad 1 (validando que haya al menos 1 de stock)
          if (product.stock > 0) {
            set({ items: [...currentItems, { ...product, quantity: 1 }] });
          }
        }
      },
      removeItem: (_id) => {
        set({ items: get().items.filter((item) => item._id !== _id) });
      },
      updateQuantity: (_id, quantity) => {
        const currentItems = get().items;
        const targetItem = currentItems.find((item) => item._id === _id);

        if (!targetItem) return;

        // Validamos que la cantidad esté entre 1 y el stock máximo disponible
        const newQuantity = Math.max(1, Math.min(quantity, targetItem.stock));

        set({
          items: currentItems.map((item) =>
            item._id === _id ? { ...item, quantity: newQuantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      totalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);