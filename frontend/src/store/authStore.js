import { create } from 'zustand';

/**
 * Auth Store
 * - State lives entirely in memory
 */
const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,

  isLoggingOut: false,
  setLoggingOut: (status) => set({ isLoggingOut: status }),

  // Set user after login
  setAuth: (user) =>
    set({ user, isAuthenticated: true, isLoggingOut: false }),

  // Set initialization status
  setAuthChecked: (status) => set({ isAuthChecked: status }),

  // Update user profile data
  setUser: (user) => set({ user }),

  // Log out — clear everything
  logout: () => set({ user: null, isAuthenticated: false }),

  // Helpers
  isAdmin: () => get().user?.role === 'ADMIN',
}));

export { useAuthStore };
