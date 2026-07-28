'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import cartService from '@/services/cartService';
import { useAuthStore } from '@/store/authStore';

/**
 * useCart hook — cart state, add/remove/update with TanStack Query
 */
const useCart = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { setCart, itemCount } = useCartStore();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await cartService.getCart();
      const cartData = res.data.data;
      setCart(cartData);
      return cartData;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const invalidateCart = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

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
      invalidateCart();
      toast.success('Cart cleared');
    },
  });

  return {
    cart,
    isLoading,
    itemCount,
    addToCart: addToCartMutation.mutate,
    updateItem: updateItemMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAdding: addToCartMutation.isPending,
  };
};

export default useCart;
