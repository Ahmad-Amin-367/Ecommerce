import { useQuery } from '@tanstack/react-query';
import categoryService from '@/services/categoryService';

/**
 * useCategories — fetch all categories
 */
export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      const res = await categoryService.getCategories(params);
      return res.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
