import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/types';

export interface CartItem {
  product: Product;
  quantity: number; // Number of packs (or units if no packSize)
  medida?: string;
  color?: string;
  packSize?: number; // 25, 50, o 100
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, medida?: string, color?: string, packSize?: number, openDrawer?: boolean) => void;
  removeItem: (productId: string, packSize?: number) => void;
  updateQuantity: (productId: string, quantity: number, packSize?: number) => void;
  clearCart: () => void;
  addItemsFromFavorites: (items: { product: Product; selectedPack: number }[]) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1, medida, color, packSize, openDrawer = true) => {
        set((state) => {
          const safeMedida = medida || product.medidas?.[0] || '';
          const safeColor = color || product.colores?.[0] || '';
          const safePackSize = packSize || product.packs?.[0]?.cantidad || 25;

          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              (item.medida || '') === safeMedida &&
              (item.color || '') === safeColor &&
              (item.packSize || 0) === safePackSize
          );

          let updatedItems: CartItem[];
          if (existingIndex >= 0) {
            updatedItems = state.items.map((item, idx) =>
              idx === existingIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            updatedItems = [
              ...state.items,
              {
                product,
                quantity,
                medida: safeMedida,
                color: safeColor,
                packSize: safePackSize,
              },
            ];
          }

          return {
            items: updatedItems,
            isOpen: openDrawer ? true : state.isOpen,
          };
        });
      },

      removeItem: (productId, packSize) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId && (packSize === undefined || item.packSize === packSize))
          ),
        }));
      },

      updateQuantity: (productId, quantity, packSize) => {
        if (quantity <= 0) {
          get().removeItem(productId, packSize);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && (packSize === undefined || item.packSize === packSize)
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      addItemsFromFavorites: (favorites) => {
        set((state) => {
          const newItems = [...state.items];
          favorites.forEach((fav) => {
            const safePack = fav.selectedPack || fav.product.packs?.[0]?.cantidad || 25;
            const existing = newItems.find(
              (item) =>
                item.product.id === fav.product.id &&
                (item.packSize || 0) === safePack
            );
            if (existing) {
              existing.quantity += 1;
            } else {
              newItems.push({
                product: fav.product,
                quantity: 1,
                medida: fav.product.medidas?.[0] || '',
                color: fav.product.colores?.[0] || '',
                packSize: safePack,
              });
            }
          });
          return { items: newItems, isOpen: true };
        });
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce((total, item) => {
          const packs = Array.isArray(item.product?.packs) ? item.product.packs : [];
          if (item.packSize) {
            const pack = packs.find((p) => p.cantidad === item.packSize);
            if (pack && typeof pack.precio === 'number') {
              return total + pack.precio * item.quantity;
            }
          }
          const base = typeof item.product?.precio === 'number' ? item.product.precio : 0;
          return total + base * (item.packSize || 1) * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'gudstor-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
