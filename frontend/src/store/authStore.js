import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth Store
 * - accessToken lives in memory only (security)
 * - user info persisted to localStorage
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // Set tokens and user after login
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      // Update just the access token (on refresh)
      setAccessToken: (accessToken) => set({ accessToken }),

      // Update user profile data
      setUser: (user) => set({ user }),

      // Log out — clear everything
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),

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
