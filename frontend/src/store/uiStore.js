import { create } from 'zustand';

/**
 * UI Store — global UI state (modals, sidebar, loading states)
 */
const useUIStore = create((set) => ({
  // Mobile menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Cart drawer / sidebar
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

  // Search overlay
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  setIsSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

  // Global loading (e.g. route changes)
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export { useUIStore };
