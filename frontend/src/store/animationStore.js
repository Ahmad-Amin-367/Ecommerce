import { create } from 'zustand';

export const useAnimationStore = create((set, get) => ({
  flyingItems: [],
  tabVisible: false,
  tabTimeout: null,
  targetRect: null, // The coordinates of the bottom tab

  setTargetRect: (rect) => set({ targetRect: rect }),

  addFlyingItem: (product, startRect) => {
    const id = Date.now() + Math.random();
    const { tabTimeout } = get();

    // Clear old timeout if tab is already visible
    if (tabTimeout) clearTimeout(tabTimeout);

    // Set new timeout to hide tab after 4 seconds of inactivity
    const newTimeout = setTimeout(() => {
      set({ tabVisible: false });
    }, 4000);

    set((state) => ({
      tabVisible: true,
      tabTimeout: newTimeout,
      flyingItems: [
        ...state.flyingItems,
        { id, product, startRect }
      ],
    }));
  },

  removeFlyingItem: (id) => {
    set((state) => ({
      flyingItems: state.flyingItems.filter((item) => item.id !== id),
    }));
  },

  hideTab: () => {
    const { tabTimeout } = get();
    if (tabTimeout) clearTimeout(tabTimeout);
    set({ tabVisible: false, tabTimeout: null });
  }
}));
