import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Compute subtotal and item count for cart items
 */
const computeTotals = (items = []) => {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + Number(i.product?.price || 0) * i.quantity, 0);
  return {
    itemCount,
    subtotal: parseFloat(subtotal.toFixed(2)),
  };
};

/**
 * Cart Store
 * - Persisted to localStorage for guest cart preview & offline/unauthenticated cart
 * - Real-time cross-tab synchronization via browser storage event listener
 * - Merged with server cart on user login
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],       // [{ product, quantity }]
      subtotal: 0,
      itemCount: 0,
      isCartOpen: false,

      // UI Actions
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      // Replace entire cart (from server response or sync)
      setCart: (cart) => {
        const items = cart?.items || [];
        const { itemCount, subtotal } = computeTotals(items);
        set({
          items,
          subtotal: cart?.subtotal !== undefined ? cart.subtotal : subtotal,
          itemCount,
        });
      },

      // Guest Cart Actions
      addGuestItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.product.id === product.id);
        const maxStock = product.stock !== undefined ? product.stock : 999;
        
        let newItems;
        if (existingIndex > -1) {
          newItems = [...currentItems];
          const existingItem = newItems[existingIndex];
          const newQty = Math.min(existingItem.quantity + quantity, maxStock);
          newItems[existingIndex] = { ...existingItem, quantity: newQty };
        } else {
          const newQty = Math.min(quantity, maxStock);
          newItems = [...currentItems, { product, quantity: newQty }];
        }

        const { itemCount, subtotal } = computeTotals(newItems);
        set({ items: newItems, subtotal, itemCount });
      },

      updateGuestItem: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeGuestItem(productId);
          return;
        }

        const newItems = get().items.map((item) => {
          if (item.product.id === productId) {
            const maxStock = item.product.stock !== undefined ? item.product.stock : 999;
            return { ...item, quantity: Math.min(quantity, maxStock) };
          }
          return item;
        });

        const { itemCount, subtotal } = computeTotals(newItems);
        set({ items: newItems, subtotal, itemCount });
      },

      removeGuestItem: (productId) => {
        const newItems = get().items.filter((item) => item.product.id !== productId);
        const { itemCount, subtotal } = computeTotals(newItems);
        set({ items: newItems, subtotal, itemCount });
      },

      // Clear local cart
      clearCart: () => set({ items: [], subtotal: 0, itemCount: 0 }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        itemCount: state.itemCount,
      }),
    }
  )
);

// Cross-tab real-time sync for localStorage updates
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart-storage') {
      useCartStore.persist.rehydrate();
    }
  });
}

export { useCartStore };
