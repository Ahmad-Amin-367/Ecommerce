import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth Store
 * - user info persisted to localStorage
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      // Set user after login
      setAuth: (user) =>
        set({ user, isAuthenticated: true }),

      // Update user profile data
      setUser: (user) => set({ user }),

      // Log out — clear everything
      logout: () => set({ user: null, isAuthenticated: false }),

      // Helpers
      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    {
      name: 'auth-storage',
      // Only persist user info, NOT the access token (security)
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export { useAuthStore };
