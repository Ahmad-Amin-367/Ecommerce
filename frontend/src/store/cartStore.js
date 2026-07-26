import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cart Store
 * - Persisted to localStorage for guest cart preview
 * - Synced with server cart on login
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],       // [{ product, quantity }]
      subtotal: 0,
      itemCount: 0,

      // Replace entire cart (from server response)
      setCart: (cart) => {
        const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
        set({
          items: cart.items || [],
          subtotal: cart.subtotal || 0,
          itemCount,
        });
      },

      // Compute item count from items array
      computeCount: () => {
        const count = get().items.reduce((sum, i) => sum + i.quantity, 0);
        set({ itemCount: count });
      },

      // Clear local cart (on logout or after order)
      clearCart: () => set({ items: [], subtotal: 0, itemCount: 0 }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ itemCount: state.itemCount }),
    }
  )
);

export { useCartStore };
