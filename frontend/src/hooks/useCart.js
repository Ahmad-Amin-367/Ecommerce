'use client';
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCartStore, cloneCartItems, getItemProductId } from '@/store/cartStore';
import cartService from '@/services/cartService';
import { useAuthStore } from '@/store/authStore';

/**
 * useCart hook — Production-grade cart with immediate, anti-spam single-flight
 * mutations, button disable states, granular loaders, and server truth sync.
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

  // In-flight transient states from global cartStore
  const updatingItem = useCartStore((s) => s.updatingItem);
  const removingItemId = useCartStore((s) => s.removingItemId);
  const addingProductId = useCartStore((s) => s.addingProductId);
  const setUpdatingItem = useCartStore((s) => s.setUpdatingItem);
  const setRemovingItemId = useCartStore((s) => s.setRemovingItemId);
  const setAddingProductId = useCartStore((s) => s.setAddingProductId);

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

  // ─── 1. Single-Flight Add to Cart ───────────────────────────────────────────
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.addToCart(productId, quantity),
    onMutate: async ({ productId, product, quantity }) => {
      setAddingProductId(productId);
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = getCartSnapshot();

      if (product) {
        addGuestItem(product, quantity);
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      console.error('Add to cart failed:', err?.response?.data?.message || err.message);

      if (context?.previousCart) {
        syncCartState(context.previousCart);
      }

      toast.error(err.response?.data?.message || 'Could not add item to cart. Reverted.');
    },
    onSuccess: (res) => {
      if (res.data?.data) {
        syncCartState(res.data.data);
      }
      toast.success('Added to cart', { position: 'top-right' });
    },
    onSettled: () => {
      setAddingProductId(null);
    },
  });

  const addToCart = ({ productId, quantity = 1, product }) => {
    const targetId = productId || product?.id || product?.productId;
    if (!targetId) {
      toast.error('Product details missing');
      return;
    }

    // Guard: Prevent spam clicking if this product is already in flight
    if (addingProductId === targetId) return;

    if (isAuthenticated) {
      addToCartMutation.mutate({ productId: targetId, quantity, product });
    } else {
      setAddingProductId(targetId);
      if (product) {
        addGuestItem(product, quantity);
        toast.success('Added to cart', { position: 'top-right' });
      }
      setTimeout(() => {
        setAddingProductId(null);
      }, 250);
    }
  };

  // ─── 2. Single-Flight Quantity Update (+ / -) ──────────────────────────────
  const updateItemMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.updateCartItem(productId, quantity),
    onMutate: async ({ productId, action, snapshot }) => {
      setUpdatingItem({ id: productId, action });
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      return { previousCart: snapshot };
    },
    onError: (err, { productId }, context) => {
      console.error('Update quantity failed:', err?.response?.data?.message || err.message);

      if (context?.previousCart) {
        syncCartState(context.previousCart);
      }

      toast.error(err.response?.data?.message || 'Failed to update quantity. Reverted.');
    },
    onSuccess: (res) => {
      if (res.data?.data) {
        syncCartState(res.data.data);
      }
    },
    onSettled: () => {
      setUpdatingItem(null);
    },
  });

  const updateItem = ({ productId, quantity }) => {
    if (!productId) return;

    // Guard: Prevent rapid spam clicking while an update or removal is in progress
    if (updatingItem?.id === productId || removingItemId === productId) {
      return;
    }

    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    const currentItem = storeItems.find((i) => getItemProductId(i) === productId);
    const currentQty = Number(currentItem?.quantity) || 1;
    const action = quantity > currentQty ? 'increase' : 'decrease';

    const snapshot = getCartSnapshot();

    if (isAuthenticated) {
      // Optimistically update store quantity
      updateGuestItem(productId, quantity);
      // Immediately dispatch mutation to database (buttons are disabled while in flight)
      updateItemMutation.mutate({ productId, quantity, action, snapshot });
    } else {
      setUpdatingItem({ id: productId, action });
      updateGuestItem(productId, quantity);
      setTimeout(() => {
        setUpdatingItem(null);
      }, 200);
    }
  };

  // ─── 3. Single-Flight Remove Item ───────────────────────────────────────────
  const removeItemMutation = useMutation({
    mutationFn: (productId) => cartService.removeFromCart(productId),
    onMutate: async (productId) => {
      setRemovingItemId(productId);
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = getCartSnapshot();
      return { previousCart };
    },
    onError: (err, productId, context) => {
      console.error('Remove item failed:', err?.response?.data?.message || err.message);

      if (context?.previousCart) {
        syncCartState(context.previousCart);
      }

      toast.error(err.response?.data?.message || 'Failed to remove item. Reverted.');
    },
    onSuccess: (res, productId) => {
      if (res.data?.data) {
        syncCartState(res.data.data);
      } else {
        removeGuestItem(productId);
      }
      toast.success('Item removed');
    },
    onSettled: () => {
      setRemovingItemId(null);
    },
  });

  const removeItem = (productId) => {
    if (!productId) return;

    // Guard: Prevent duplicate removal calls
    if (removingItemId === productId || updatingItem?.id === productId) {
      return;
    }

    if (isAuthenticated) {
      removeItemMutation.mutate(productId);
    } else {
      setRemovingItemId(productId);
      removeGuestItem(productId);
      toast.success('Item removed');
      setTimeout(() => {
        setRemovingItemId(null);
      }, 200);
    }
  };

  // ─── 4. Clear Cart ──────────────────────────────────────────────────────────
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
    isAdding: !!addingProductId,
    addingProductId,
    updatingItem,
    removingItemId,
    isItemUpdating: (productId, action) =>
      updatingItem?.id === productId && (!action || updatingItem?.action === action),
    isItemRemoving: (productId) => removingItemId === productId,
    isItemBusy: (productId) =>
      updatingItem?.id === productId || removingItemId === productId || addingProductId === productId,
  };
};

export default useCart;
