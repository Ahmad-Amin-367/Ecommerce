'use client';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import testimonialService from '@/services/testimonialService';

/**
 * useTestimonials — fetch testimonials list
 * @param {Object} params - optional query params (e.g. { admin: true })
 */
export const useTestimonials = (params = {}) => {
  return useQuery({
    queryKey: ['testimonials', params],
    queryFn: async () => {
      const res = await testimonialService.getTestimonials(params);
      return res.data.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

/**
 * useCreateTestimonial — Admin mutation
 */
export const useCreateTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => testimonialService.createTestimonial(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Review added successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add review');
    },
  });
};

/**
 * useUpdateTestimonial — Admin mutation
 */
export const useUpdateTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => testimonialService.updateTestimonial(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Review updated!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update review');
    },
  });
};

/**
 * useDeleteTestimonial — Admin mutation
 */
export const useDeleteTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => testimonialService.deleteTestimonial(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Review deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete review');
    },
  });
};
