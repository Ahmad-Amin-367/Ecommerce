'use client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import authService from '@/services/authService';
import cartService from '@/services/cartService';

/**
 * useAuth hook — provides auth actions and state
 */
const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, logout: logoutStore, isAdmin } = useAuthStore();
  const clearCart = useCartStore((s) => s.clearCart);

  const login = async (data, redirectTo) => {
    const response = await authService.login(data);
    const { user, accessToken, refreshToken } = response.data.data;

    // Save tokens locally for cross-domain Bearer fallback
    if (typeof window !== 'undefined') {
      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    }

    setAuth(user);

    // Sync guest cart if local items exist, otherwise fetch user's saved DB cart
    const localItems = useCartStore.getState().items;
    if (localItems && localItems.length > 0) {
      try {
        const payload = localItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));
        const syncRes = await cartService.syncCart(payload);
        useCartStore.getState().setCart(syncRes.data.data);
      } catch (err) {
        console.error('Failed to sync guest cart:', err);
      }
    } else {
      try {
        const cartRes = await cartService.getCart();
        useCartStore.getState().setCart(cartRes.data.data);
      } catch (err) {
        console.error('Failed to fetch user cart on login:', err);
      }
    }

    toast.success(`Welcome back, ${user.name}!`);

    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.push(user.role === 'ADMIN' ? '/admin' : '/');
    }
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    logoutStore();
    clearCart();
    toast.success('Logged out successfully');
    router.push('/');
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
