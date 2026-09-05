'use client';
import { useRef, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCartStore, cloneCartItems, getItemProductId } from '@/store/cartStore';
import cartService from '@/services/cartService';
import { useAuthStore } from '@/store/authStore';

/**
 * useCart hook — Production-grade cart with standard TanStack Query
 * onMutate optimistic updates, debounced quantity changes, and instant rollbacks.
 */
const useCart = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeItems = useCartStore((s) => s.items);
  const storeSubtotal = useCartStore((s) => s.subtotal);
  const itemCount = useCartStore((s) => s.itemCount);
  const setCart = useCartStore((s) => s.setCart);
  const addGuestItem = useCartStore((s) => s.addGuestItem);
  const updateGuestItem = useCartStore((s) => s.updateGuestItem);
  const removeGuestItem = useCartStore((s) => s.removeGuestItem);
  const clearCartStore = useCartStore((s) => s.clearCart);

  // Debounce timers & baseline snapshots for rapid +/- clicks
  const debounceTimers = useRef({});
  const baselineSnapshots = useRef({});

  // 1. Initial cart query for authenticated users (cached for 5 min)
  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await cartService.getCart();
      const fetchedCart = res.data?.data;
      if (fetchedCart) {
        setCart(fetchedCart);
      }
      return fetchedCart;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  // Helper: Synchronize server cart with Zustand and React Query cache
  const syncCartState = useCallback(
    (updatedCart) => {
      if (!updatedCart) return;
      setCart(updatedCart);
      queryClient.setQueryData(['cart'], updatedCart);
    },
    [setCart, queryClient]
  );

  // Helper: Take an immutable deep-cloned snapshot of current cart
  const getCartSnapshot = useCallback(() => {
    const state = useCartStore.getState();
    return {
      items: cloneCartItems(state.items),
      subtotal: state.subtotal,
      itemCount: state.itemCount,
    };
  }, []);

  // ─── 1. Optimistic Add to Cart ──────────────────────────────────────────────
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.addToCart(productId, quantity),
    onMutate: async ({ product, quantity, snapshot }) => {
      // Cancel outgoing queries so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      // Save deep snapshot into React Query context
      const previousCart = snapshot || getCartSnapshot();

      // Optimistically update store immediately
      if (product) {
        addGuestItem(product, quantity);
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      console.error('Add to cart failed:', err?.response?.data?.message || err.message);

      // ↺ Revert state to previous snapshot immediately
      if (context?.previousCart) {
        syncCartState(context.previousCart);
      }

      toast.error(err.response?.data?.message || 'Could not add item to cart. Reverted.');
    },
    onSuccess: (res) => {
      if (res.data?.data) {
        syncCartState(res.data.data);
      }
    },
  });

  const addToCart = ({ productId, quantity = 1, product }) => {
    const targetId = productId || product?.id || product?.productId;
    if (!targetId) {
      toast.error('Product details missing');
      return;
    }

    const snapshot = getCartSnapshot();

    if (isAuthenticated) {
      // Triggers onMutate -> instant UI update -> background POST -> rollback on error
      addToCartMutation.mutate({ productId: targetId, quantity, product, snapshot });
      toast.success('Added to cart', { position: 'top-right' });
    } else {
      if (product) {
        addGuestItem(product, quantity);
        toast.success('Added to cart', { position: 'top-right' });
      }
    }
  };

  // ─── 2. Optimistic & Debounced Quantity Update (+ / -) ─────────────────────
  const updateItemMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.updateCartItem(productId, quantity),
    onMutate: async ({ snapshot }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      return { previousCart: snapshot };
    },
    onError: (err, { productId }, context) => {
      console.error('Update quantity failed:', err?.response?.data?.message || err.message);

      // ↺ Revert state to baseline snapshot before rapid clicks began
      const snapshotToRestore = context?.previousCart || baselineSnapshots.current[productId];
      if (snapshotToRestore) {
        syncCartState(snapshotToRestore);
      }
      delete baselineSnapshots.current[productId];

      toast.error(err.response?.data?.message || 'Failed to update quantity. Reverted.');
    },
    onSuccess: (res, { productId }) => {
      delete baselineSnapshots.current[productId];
      if (res.data?.data) {
        syncCartState(res.data.data);
      }
    },
  });

  const updateItem = ({ productId, quantity }) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    // Capture baseline snapshot before the first +/- click
    if (!baselineSnapshots.current[productId]) {
      baselineSnapshots.current[productId] = getCartSnapshot();
    }

    // ⚡ 0ms UI Update on screen immediately
    updateGuestItem(productId, quantity);

    if (isAuthenticated) {
      if (debounceTimers.current[productId]) {
        clearTimeout(debounceTimers.current[productId]);
      }

      const snapshot = baselineSnapshots.current[productId];

      debounceTimers.current[productId] = setTimeout(() => {
        updateItemMutation.mutate({ productId, quantity, snapshot });
      }, 400);
    }
  };

  // ─── 3. Optimistic Remove Item ──────────────────────────────────────────────
  const removeItemMutation = useMutation({
    mutationFn: (productId) => cartService.removeFromCart(productId),
    onMutate: async ({ snapshot }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      return { previousCart: snapshot };
    },
    onError: (err, productId, context) => {
      console.error('Remove item failed:', err?.response?.data?.message || err.message);

      if (context?.previousCart) {
        syncCartState(context.previousCart);
      }

      toast.error(err.response?.data?.message || 'Failed to remove item. Reverted.');
    },
    onSuccess: (res) => {
      if (res.data?.data) {
        syncCartState(res.data.data);
      }
    },
  });

  const removeItem = (productId) => {
    const snapshot = getCartSnapshot();

    // ⚡ 0ms UI Update
    removeGuestItem(productId);
    toast.success('Item removed');

    if (isAuthenticated) {
      if (debounceTimers.current[productId]) {
        clearTimeout(debounceTimers.current[productId]);
        delete debounceTimers.current[productId];
      }
      delete baselineSnapshots.current[productId];

      removeItemMutation.mutate(productId, { snapshot });
    }
  };

  // ─── 4. Optimistic Clear Cart ───────────────────────────────────────────────
  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = getCartSnapshot();
      clearCartStore();
      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        syncCartState(context.previousCart);
      }
      toast.error(err.response?.data?.message || 'Failed to clear cart.');
    },
    onSuccess: () => {
      queryClient.setQueryData(['cart'], { items: [], subtotal: 0 });
    },
  });

  const clearCart = () => {
    toast.success('Cart cleared');
    if (isAuthenticated) {
      clearCartMutation.mutate();
    } else {
      clearCartStore();
    }
  };

  const currentCart = {
    items: storeItems,
    subtotal: storeSubtotal,
  };

  return {
    cart: currentCart,
    isLoading: isAuthenticated ? isLoading : false,
    itemCount,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    isAdding: addToCartMutation.isPending,
  };
};

export default useCart;
