import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/types';

export interface CartItem {
  product: Product;
  quantity: number;
  medida?: string;
  color?: string;
  packSize?: number; // 25, 50, o 100
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, medida?: string, color?: string, packSize?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addItemsFromFavorites: (items: { product: Product; selectedPack: number }[]) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, medida, color, packSize) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id &&
              item.medida === medida &&
              item.color === color &&
              item.packSize === packSize
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id &&
                item.medida === medida &&
                item.color === color &&
                item.packSize === packSize
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { product, quantity, medida, color, packSize }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      addItemsFromFavorites: (favorites) => {
        set((state) => {
          const newItems = [...state.items];
          favorites.forEach((fav) => {
            const existingItem = newItems.find(
              (item) =>
                item.product.id === fav.product.id &&
                item.packSize === fav.selectedPack
            );
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              newItems.push({
                product: fav.product,
                quantity: 1,
                medida: fav.product.medidas[0],
                color: fav.product.colores[0],
                packSize: fav.selectedPack,
              });
            }
          });
          return { items: newItems };
        });
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce((total, item) => {
          let unitPrice = item.product.precio;
          if (item.packSize) {
            const pack = item.product.packs.find((p) => p.cantidad === item.packSize);
            if (pack) {
              unitPrice = pack.precio / pack.cantidad;
            }
          }
          return total + unitPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'gudstor-cart',
    }
  )
);
