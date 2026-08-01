'use client';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userService from '@/services/userService';

/**
 * useUsers — fetch paginated users list with search & filters (Admin)
 * @param {Object} params - { page, limit, search, role, isActive }
 */
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: async () => {
      const res = await userService.getAllUsers(params);
      return res.data;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * useAdminUpdateUser — Admin mutation to update user role or status
 */
export const useAdminUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }) => userService.adminUpdateUser(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update user');
    },
  });
};
