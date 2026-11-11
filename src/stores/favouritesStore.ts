import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavouritesState {
  savedPropertyIds: string[];
  recentlyViewedIds: string[];
  recentSearches: string[];
  
  toggleSave: (propertyId: string) => boolean; // returns new saved state
  isSaved: (propertyId: string) => boolean;
  addRecentlyViewed: (propertyId: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  resetFavourites: () => void;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      savedPropertyIds: ['prop-1', 'prop-3'],
      recentlyViewedIds: ['prop-1', 'prop-2', 'prop-5'],
      recentSearches: ['Kozhikode', 'PG in Ramanattukara', 'Flats near Kakkanad'],

      toggleSave: (propertyId: string) => {
        const { savedPropertyIds } = get();
        const exists = savedPropertyIds.includes(propertyId);
        if (exists) {
          set({ savedPropertyIds: savedPropertyIds.filter((id) => id !== propertyId) });
          return false;
        } else {
          set({ savedPropertyIds: [propertyId, ...savedPropertyIds] });
          return true;
        }
      },

      isSaved: (propertyId: string) => {
        return get().savedPropertyIds.includes(propertyId);
      },

      addRecentlyViewed: (propertyId: string) => {
        set((state) => ({
          recentlyViewedIds: [
            propertyId,
            ...state.recentlyViewedIds.filter((id) => id !== propertyId),
          ].slice(0, 10),
        }));
      },

      addRecentSearch: (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => ({
          recentSearches: [
            trimmed,
            ...state.recentSearches.filter((q) => q.toLowerCase() !== trimmed.toLowerCase()),
          ].slice(0, 6),
        }));
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      resetFavourites: () => {
        set({
          savedPropertyIds: ['prop-1', 'prop-3'],
          recentlyViewedIds: ['prop-1', 'prop-2', 'prop-5'],
          recentSearches: ['Kozhikode', 'PG in Ramanattukara'],
        });
      },
    }),
    {
      name: 'haven_user_preferences',
    }
  )
);
