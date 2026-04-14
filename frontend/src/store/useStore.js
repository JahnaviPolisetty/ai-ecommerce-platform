import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products } from '../data/products';

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isLoggedIn: false,
      login: (userData) => set({ user: userData, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),

      // Cart
      cart: [],
      addToCart: (product, quantity = 1, selectedOptions = {}) => {
        const cart = get().cart;
        const key = `${product.id}-${JSON.stringify(selectedOptions)}`;
        const existing = cart.find((item) => item.key === key);
        if (existing) {
          set({
            cart: cart.map((item) =>
              item.key === key
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity, selectedOptions, key }] });
        }
      },
      removeFromCart: (key) => set({ cart: get().cart.filter((i) => i.key !== key) }),
      updateCartQty: (key, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(key);
          return;
        }
        set({
          cart: get().cart.map((i) =>
            i.key === key ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () =>
        get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getCartCount: () =>
        get().cart.reduce((sum, i) => sum + i.quantity, 0),

      // Wishlist
      wishlist: [],
      toggleWishlist: (product) => {
        const wishlist = get().wishlist;
        const exists = wishlist.find((p) => p.id === product.id);
        if (exists) {
          set({ wishlist: wishlist.filter((p) => p.id !== product.id) });
        } else {
          set({ wishlist: [...wishlist, product] });
        }
      },
      isInWishlist: (id) => get().wishlist.some((p) => p.id === id),

      // Orders
      orders: [],
      placeOrder: (orderData) => {
        const order = {
          id: `AMZ-${Date.now()}`,
          date: new Date().toISOString(),
          status: 'Processing',
          items: get().cart,
          total: get().getCartTotal(),
          ...orderData,
        };
        set({ orders: [order, ...get().orders] });
        get().clearCart();
        return order;
      },

      // Recently Viewed
      recentlyViewed: [],
      addToRecentlyViewed: (product) => {
        const recent = get().recentlyViewed.filter((p) => p.id !== product.id);
        set({ recentlyViewed: [product, ...recent].slice(0, 10) });
      },

      // Search history
      searchHistory: [],
      addSearchHistory: (query) => {
        const history = get().searchHistory.filter((q) => q !== query);
        set({ searchHistory: [query, ...history].slice(0, 10) });
      },
      clearSearchHistory: () => set({ searchHistory: [] }),

      // UI State
      sidebarOpen: false,
      setSidebarOpen: (val) => set({ sidebarOpen: val }),

      // AI Recommendations
      aiRecommendations: [],
      setAIRecommendations: (recs) => set({ aiRecommendations: recs }),
    }),
    {
      name: 'amazon-clone-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        orders: state.orders,
        recentlyViewed: state.recentlyViewed,
        searchHistory: state.searchHistory,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
