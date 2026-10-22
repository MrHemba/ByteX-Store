import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from './types';

/** Cantidad máxima que se puede cotizar de un producto */
export function maxQuantity(product: Product): number {
  return product.es_servicio ? 99 : Math.max(0, product.stock);
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  /** Reemplaza los productos guardados por su versión actual; null = ya no está publicado */
  refreshProducts: (fresh: Record<string, Product | null>) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        const max = maxQuantity(product);
        if (max === 0) return;
        const items = get().items;
        const existing = items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id
                ? { product, quantity: Math.min(i.quantity + 1, max) }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
        set({ isOpen: true });
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: Math.min(quantity, maxQuantity(i.product)) }
              : i
          ),
        });
      },

      refreshProducts: (fresh) =>
        set({
          items: get().items.flatMap((i) => {
            if (!(i.product.id in fresh)) return [i];
            const product = fresh[i.product.id];
            if (!product) return [];
            const quantity = Math.min(i.quantity, maxQuantity(product));
            return quantity > 0 ? [{ product, quantity }] : [];
          }),
        }),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.precio * i.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    // isOpen no se persiste: el drawer no debe abrirse solo al recargar
    { name: 'bytex-cart', partialize: (s) => ({ items: s.items }) }
  )
);
