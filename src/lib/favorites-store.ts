import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/types';

export interface FavoriteItem {
  product: Product;
  selectedPack: number; // 25, 50, o 100
  addedAt: number;      // timestamp
}

interface FavoritesState {
  items: FavoriteItem[];
  addFavorite: (product: Product, selectedPack?: number) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: Product, selectedPack?: number) => boolean; // returns new state
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  addAllToCart: () => FavoriteItem[]; // returns items for cart transfer
  totalFavorites: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      addFavorite: (product, selectedPack = 25) => {
        set((state) => {
          const exists = state.items.find((item) => item.product.id === product.id);
          if (exists) return state;
          return {
            items: [
              ...state.items,
              { product, selectedPack, addedAt: Date.now() },
            ],
          };
        });
      },

      removeFavorite: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      toggleFavorite: (product, selectedPack = 25) => {
        const isFav = get().items.some((item) => item.product.id === product.id);
        if (isFav) {
          get().removeFavorite(product.id);
          return false;
        } else {
          get().addFavorite(product, selectedPack);
          return true;
        }
      },

      isFavorite: (productId) => {
        return get().items.some((item) => item.product.id === productId);
      },

      clearFavorites: () => set({ items: [] }),

      addAllToCart: () => {
        return get().items;
      },

      totalFavorites: () => {
        return get().items.length;
      },
    }),
    {
      name: 'gudstor-favorites',
    }
  )
);
