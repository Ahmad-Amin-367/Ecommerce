'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import orderService from '@/services/orderService';

/**
 * useMyOrders — customer's order history
 */
export const useMyOrders = (params = {}) => {
  return useQuery({
    queryKey: ['my-orders', params],
    queryFn: async () => {
      const res = await orderService.getMyOrders(params);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * useOrder — single order detail
 */
export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await orderService.getOrder(id);
      return res.data.data;
    },
    enabled: !!id,
  });
};

/**
 * usePlaceOrder — mutation to checkout
 */
export const usePlaceOrder = () => {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => orderService.placeOrder(data),
    onSuccess: (res) => {
      const order = res.data.data;
      qc.invalidateQueries({ queryKey: ['my-orders'] });
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Order placed successfully!');
      router.push(`/orders/${order.id}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to place order'),
  });
};

/**
 * useCancelOrder — customer cancel
 */
export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => orderService.cancelOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-orders'] });
      toast.success('Order cancelled');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to cancel order'),
  });
};

/**
 * useUpdateOrderStatus — admin mutation
 */
export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update status'),
  });
};
