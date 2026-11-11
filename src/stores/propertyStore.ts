import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Property, FilterState, PropertyCategory } from '../types';
import { INITIAL_PROPERTIES } from '../data/seedData';

interface PropertyState {
  properties: Property[];
  searchQuery: string;
  filters: FilterState;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  getPropertyById: (id: string) => Property | undefined;
  getPropertiesByBroker: (brokerId: string) => Property[];
  addProperty: (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'unlockCount'>) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  duplicateProperty: (id: string) => Property | null;
  incrementViewCount: (id: string) => void;
  incrementUnlockCount: (id: string) => void;
  resetToDefault: () => void;
}

export const initialFilters: FilterState = {
  searchQuery: '',
  city: 'All',
  locality: 'All',
  category: 'All',
  minRent: 0,
  maxRent: 100000,
  genderPreference: 'All',
  occupancyType: 'All',
  furnishing: 'All',
  amenities: [],
  availableOnly: false,
  sortBy: 'newest',
};

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set, get) => ({
      properties: INITIAL_PROPERTIES,
      searchQuery: '',
      filters: initialFilters,

      setSearchQuery: (query) => {
        set((state) => ({
          searchQuery: query,
          filters: { ...state.filters, searchQuery: query },
        }));
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      resetFilters: () => {
        set({
          filters: initialFilters,
          searchQuery: '',
        });
      },

      getPropertyById: (id: string) => {
        return get().properties.find((p) => p.id === id);
      },

      getPropertiesByBroker: (brokerId: string) => {
        return get().properties.filter((p) => p.brokerId === brokerId);
      },

      addProperty: (data) => {
        const newProp: Property = {
          ...data,
          id: `prop-${Date.now()}`,
          viewCount: 1,
          unlockCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          properties: [newProp, ...state.properties],
        }));

        return newProp;
      },

      updateProperty: (id, updates) => {
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deleteProperty: (id) => {
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== id),
        }));
      },

      duplicateProperty: (id) => {
        const prop = get().properties.find((p) => p.id === id);
        if (!prop) return null;

        const duplicated: Property = {
          ...prop,
          id: `prop-${Date.now()}`,
          title: `${prop.title} (Copy)`,
          viewCount: 0,
          unlockCount: 0,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          properties: [duplicated, ...state.properties],
        }));

        return duplicated;
      },

      incrementViewCount: (id) => {
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p
          ),
        }));
      },

      incrementUnlockCount: (id) => {
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === id ? { ...p, unlockCount: p.unlockCount + 1 } : p
          ),
        }));
      },

      resetToDefault: () => {
        set({
          properties: INITIAL_PROPERTIES,
          filters: initialFilters,
          searchQuery: '',
        });
      },
    }),
    {
      name: 'haven_properties_store',
    }
  )
);
