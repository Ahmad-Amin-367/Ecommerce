import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Safe helper to extract product ID from an item
 */
export const getItemProductId = (item) =>
  item?.product?.id || item?.productId || item?.id;

/**
 * Deep clone cart items array to prevent in-memory mutation leakage
 */
export const cloneCartItems = (items = []) =>
  items.map((item) => ({
    ...item,
    quantity: Number(item.quantity) || 1,
    product: item.product ? { ...item.product } : null,
  }));

/**
 * Compute subtotal and item count for cart items safely
 */
export const computeTotals = (items = []) => {
  const itemCount = items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  const subtotal = items.reduce((sum, i) => {
    const price = Number(i.product?.price ?? i.price ?? 0);
    const qty = Number(i.quantity) || 0;
    return sum + price * qty;
  }, 0);
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
      items: [], // [{ product, quantity, productId? }]
      subtotal: 0,
      itemCount: 0,
      isCartOpen: false,

      // UI Actions
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      // In-flight transient mutation states (NOT persisted to localStorage)
      updatingItem: null, // { id: productId, action: 'increase' | 'decrease' } | null
      removingItemId: null, // productId | null
      addingProductId: null, // productId | null

      setUpdatingItem: (item) => set({ updatingItem: item }),
      setRemovingItemId: (id) => set({ removingItemId: id }),
      setAddingProductId: (id) => set({ addingProductId: id }),

      // Replace entire cart (from server response or rollback)
      setCart: (cart) => {
        const rawItems = cart?.items || [];
        const items = cloneCartItems(rawItems);
        const { itemCount, subtotal } = computeTotals(items);
        set({
          items,
          subtotal: cart?.subtotal !== undefined ? Number(cart.subtotal) : subtotal,
          itemCount,
        });
      },

      // Cart Item Add (Optimistic / Local)
      addGuestItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.product.id === product.id);
        
        let newItems;
        if (existingIndex > -1) {
          newItems = [...currentItems];
          const existingItem = newItems[existingIndex];
          newItems[existingIndex] = { ...existingItem, quantity: existingItem.quantity + quantity };
        } else {
          newItems = [...currentItems, { product, quantity }];
        }

        const { itemCount, subtotal } = computeTotals(newItems);
        set({ items: newItems, subtotal, itemCount });
      },

      // Cart Item Update Quantity (Optimistic / Local)
      updateGuestItem: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeGuestItem(productId);
          return;
        }

        const newItems = get().items.map((item) => {
          if (item.product.id === productId) {
            return { ...item, quantity };
          }
          return item;
        });

        const { itemCount, subtotal } = computeTotals(newItems);
        set({ items: newItems, subtotal, itemCount });
      },

      // Cart Item Remove (Optimistic / Local)
      removeGuestItem: (productId) => {
        const currentItems = cloneCartItems(get().items);
        const newItems = currentItems.filter((item) => getItemProductId(item) !== productId);
        const { itemCount, subtotal } = computeTotals(newItems);
        set({ items: newItems, subtotal, itemCount });
      },

      // Clear local cart
      clearCart: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart-storage');
        }
        set({ items: [], subtotal: 0, itemCount: 0 });
      },
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
