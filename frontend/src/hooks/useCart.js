'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import cartService from '@/services/cartService';
import { useAuthStore } from '@/store/authStore';

/**
 * useCart hook — unified cart state and actions for guest & authenticated users
 */
const useCart = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const {
    items: storeItems,
    subtotal: storeSubtotal,
    itemCount,
    setCart,
    addGuestItem,
    updateGuestItem,
    removeGuestItem,
    clearCart: clearCartStore,
  } = useCartStore();

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await cartService.getCart();
      const fetchedCart = res.data.data;
      setCart(fetchedCart);
      return fetchedCart;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const invalidateCart = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  // Authenticated Mutations
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.addToCart(productId, quantity),
    onSuccess: (res) => {
      setCart(res.data.data);
      invalidateCart();
      toast.success('Added to cart', { position: 'top-right' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add to cart'),
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.updateCartItem(productId, quantity),
    onSuccess: (res) => {
      setCart(res.data.data);
      invalidateCart();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update cart'),
  });

  const removeItemMutation = useMutation({
    mutationFn: (productId) => cartService.removeFromCart(productId),
    onSuccess: (res) => {
      setCart(res.data.data);
      invalidateCart();
      toast.success('Item removed');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to remove item'),
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      clearCartStore();
      invalidateCart();
      toast.success('Cart cleared');
    },
  });

  // Unified actions
  const addToCart = ({ productId, quantity = 1, product }) => {
    if (isAuthenticated) {
      addToCartMutation.mutate({ productId, quantity });
    } else {
      if (!product) {
        toast.error('Product details missing');
        return;
      }
      addGuestItem(product, quantity);
      toast.success('Added to cart', { position: 'top-right' });
    }
  };

  const updateItem = ({ productId, quantity }) => {
    if (isAuthenticated) {
      updateItemMutation.mutate({ productId, quantity });
    } else {
      updateGuestItem(productId, quantity);
    }
  };

  const removeItem = (productId) => {
    if (isAuthenticated) {
      removeItemMutation.mutate(productId);
    } else {
      removeGuestItem(productId);
      toast.success('Item removed');
    }
  };

  const clearCart = () => {
    if (isAuthenticated) {
      clearCartMutation.mutate();
    } else {
      clearCartStore();
      toast.success('Cart cleared');
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
