'use client';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import productService from '@/services/productService';

/**
 * useProducts — fetch paginated products with filters
 */
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await productService.getProducts(params);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
  });
};

/**
 * useProduct — fetch single product by id or slug
 */
export const useProduct = (identifier) => {
  return useQuery({
    queryKey: ['product', identifier],
    queryFn: async () => {
      const res = await productService.getProduct(identifier);
      return res.data.data;
    },
    enabled: !!identifier,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * useCreateProduct — admin mutation
 */
export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => productService.createProduct(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create product'),
  });
};

/**
 * useUpdateProduct — admin mutation
 */
export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update product'),
  });
};

/**
 * useDeleteProduct — admin mutation
 */
export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete product'),
  });
};
