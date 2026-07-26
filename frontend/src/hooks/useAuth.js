'use client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import authService from '@/services/authService';

/**
 * useAuth hook — provides auth actions and state
 */
const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, logout: logoutStore, isAdmin } = useAuthStore();
  const clearCart = useCartStore((s) => s.clearCart);

  const login = async (data) => {
    const response = await authService.login(data);
    const { accessToken, user } = response.data.data;
    setAuth(user, accessToken);
    toast.success(`Welcome back, ${user.name}!`);
    router.push(user.role === 'ADMIN' ? '/admin' : '/');
  };

  const register = async (data) => {
    await authService.register(data);
    toast.success('Account created! Please log in.');
    router.push('/login');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore — still log out locally
    }
    logoutStore();
    clearCart();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    isAdmin: isAdmin(),
    login,
    register,
    logout,
  };
};

export default useAuth;
