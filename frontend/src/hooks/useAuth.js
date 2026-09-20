'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
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
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setAuth, logout: logoutStore, isAdmin, setLoggingOut } = useAuthStore();
  const clearCart = useCartStore((s) => s.clearCart);

  const handleAuthResponse = async (response, redirectTo) => {
    const { user, accessToken, refreshToken } = response.data.data;

    // Save tokens locally for cross-domain Bearer fallback
    if (typeof window !== 'undefined') {
      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    }

    setAuth(user);

    toast.success(`Welcome back, ${user.name}!`);

    // Instant redirect without waiting for network cart sync
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.push(user.role === 'ADMIN' ? '/admin' : '/');
    }

    // Sync guest cart or fetch user's saved DB cart asynchronously in the background
    (async () => {
      const localItems = useCartStore.getState().items;
      if (localItems && localItems.length > 0) {
        try {
          const payload = localItems.map((item) => ({
            productId: item.product?.id || item.productId || item.id,
            quantity: item.quantity,
          }));
          const syncRes = await cartService.syncCart(payload);
          const updatedCart = syncRes.data?.data;
          if (updatedCart) {
            useCartStore.getState().setCart(updatedCart);
            queryClient.setQueryData(['cart'], updatedCart);
          }
        } catch (err) {
          console.error('Failed to sync guest cart in background:', err);
        }
      } else {
        try {
          const cartRes = await cartService.getCart();
          const updatedCart = cartRes.data?.data;
          if (updatedCart) {
            useCartStore.getState().setCart(updatedCart);
            queryClient.setQueryData(['cart'], updatedCart);
          }
        } catch (err) {
          console.error('Failed to fetch user cart in background:', err);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    })();
  };

  const login = async (data, redirectTo) => {
    const response = await authService.login(data);
    await handleAuthResponse(response, redirectTo);
  };

  const googleLogin = async (data, redirectTo) => {
    const response = await authService.googleLogin(data);
    await handleAuthResponse(response, redirectTo);
  };

  const register = async (data) => {
    await authService.register(data);
    toast.success('Registration pending! Check your email for the OTP.');
  };

  const verifyOtp = async (data, redirectTo) => {
    const response = await authService.verifyOtp(data);
    await handleAuthResponse(response, redirectTo);
  };

  const resendOtp = async (data) => {
    await authService.resendOtp(data);
    toast.success('A new OTP has been sent to your email.');
  };

  const forgotPassword = async (data) => {
    const response = await authService.forgotPassword(data);
    toast.success(response.data?.message || 'OTP sent to your email.');
  };

  const resetPassword = async (data) => {
    const response = await authService.resetPassword(data);
    toast.success(response.data?.message || 'Password reset successfully.');
  };

  const getLogoutTarget = (customRedirect) => {
    const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');

    // 1. If customer is logging out from checkout page, take directly to / as requested
    if (currentPath.startsWith('/checkout')) {
      return '/';
    }

    if (customRedirect) return customRedirect;

    // 2. If currently in the admin portal, take back to /login
    if (currentPath.startsWith('/admin')) {
      return '/login';
    }

    // 3. If customer is in B2B, take to B2B main page
    if (currentPath.startsWith('/b2b')) {
      return '/b2b';
    }

    // 4. If customer is in B2C (main, category, product, etc.)
    if (
      currentPath.startsWith('/b2c') ||
      currentPath.startsWith('/category') ||
      currentPath.startsWith('/products')
    ) {
      return '/b2c';
    }

    // 5. Check remembered storefront context (e.g. if logging out from /profile)
    if (typeof window !== 'undefined') {
      const savedStorefront = localStorage.getItem('hisna_active_storefront');
      if (savedStorefront === 'b2b') return '/b2b';
      if (savedStorefront === 'b2c') return '/b2c';
    }

    // Default destination for customers is the B2C main page
    return '/b2c';
  };

  const logout = async (customRedirect) => {
    const target = getLogoutTarget(customRedirect);

    // Suppress route guard redirects while logging out
    if (setLoggingOut) {
      setLoggingOut(true);
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('logout_toast', 'Logged out successfully');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('cart-storage');
    }

    logoutStore();
    clearCart();
    queryClient.removeQueries({ queryKey: ['cart'] });
    queryClient.setQueryData(['cart'], { items: [], subtotal: 0 });

    // Non-blocking server logout call
    authService.logout().catch(() => {});

    // Instant hard redirect so no component lifecycle / useEffect can hijack the navigation
    if (typeof window !== 'undefined') {
      window.location.href = target;
    } else {
      router.replace(target);
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin: isAdmin(),
    login,
    googleLogin,
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
  };
};

export default useAuth;
